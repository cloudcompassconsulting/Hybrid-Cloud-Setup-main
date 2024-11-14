// pages/api/fetch-stripe-receipt.js
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { paymentIntentId } = req.body;

    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (!paymentIntent.latest_charge) {
        throw new Error('No charges found for this payment intent');
      }

      const charge = await stripe.charges.retrieve(paymentIntent.latest_charge);
      const receiptUrl = charge.receipt_url;

      res.status(200).json({ receiptUrl });
    } catch (error) {
      console.error('Error fetching Stripe receipt:', error.message);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
