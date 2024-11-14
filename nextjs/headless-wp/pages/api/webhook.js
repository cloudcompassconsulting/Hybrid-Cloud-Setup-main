// pages/api/webhook.js
import Stripe from 'stripe';
import { buffer } from 'micro';
import axios from 'axios';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf.toString(), sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type !== 'checkout.session.completed') {
    console.log(`Unhandled event type ${event.type}`);
    return res.status(400).json({ error: `Unhandled event type ${event.type}` });
  }

  const session = event.data.object;
  const wooCommerceOrderId = session.metadata.wooCommerceOrderId;

  console.log(`Received checkout.session.completed for order ID: ${wooCommerceOrderId}`);

  try {
    // Log the URL being requested
    const orderUrl = `${process.env.NEXT_PUBLIC_WOOCOMMERCE_SITE_URL}/wp-json/wc/v3/orders/${wooCommerceOrderId}`;
    console.log(`Fetching WooCommerce order from: ${orderUrl}`);

    const orderResponse = await axios.get(orderUrl, {
      auth: {
        username: process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY,
        password: process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET,
      },
    });

    console.log(`WooCommerce order response: ${JSON.stringify(orderResponse.data)}`);

    const wooCommerceOrder = orderResponse.data;

    const response = await axios.put(
      orderUrl,
      {
        status: 'completed',
        transaction_id: session.payment_intent,
        set_paid: true,
        billing: {
          first_name: session.customer_details.name.split(' ')[0],
          last_name: session.customer_details.name.split(' ').slice(1).join(' '),
          address_1: session.customer_details.address.line1 || '',
          address_2: session.customer_details.address.line2 || '',
          city: session.customer_details.address.city || '',
          state: session.customer_details.address.state || '',
          postcode: session.customer_details.address.postal_code || '',
          country: session.customer_details.address.country || '',
          email: session.customer_details.email || '',
          phone: session.customer_details.phone || '',
        },
        shipping: {
          first_name: session.customer_details.name.split(' ')[0],
          last_name: session.customer_details.name.split(' ').slice(1).join(' '),
          address_1: session.customer_details.address.line1 || '',
          address_2: session.customer_details.address.line2 || '',
          city: session.customer_details.address.city || '',
          state: session.customer_details.address.state || '',
          postcode: session.customer_details.address.postal_code || '',
          country: session.customer_details.address.country || '',
        },
      },
      {
        auth: {
          username: process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY,
          password: process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET,
        },
      }
    );

    console.log(`Updated WooCommerce order: ${JSON.stringify(response.data)}`);

    res.status(200).json(response.data);
  } catch (error) {
    console.error(`Error updating WooCommerce order: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
}
