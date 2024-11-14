// pages/api/update-order/[order_id].js
import axios from 'axios';

export default async function handler(req, res) {
  const { order_id } = req.query;

  if (req.method === 'PUT') {
    const { customer_id } = req.body;

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_WOOCOMMERCE_SITE_URL}/wp-json/wc/v3/orders/${order_id}`,
        { customer_id },
        {
          auth: {
            username: process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY,
            password: process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET,
          },
        }
      );

      console.log(`Order ${order_id} updated with customer ID ${customer_id}`); // Log the update
      res.status(200).json(response.data);
    } catch (error) {
      console.error(`Error updating order with customer ID: ${error.message}`);
      res.status(500).json({ error: 'Failed to update order with customer ID' });
    }
  } else {
    res.setHeader('Allow', 'PUT');
    res.status(405).end('Method Not Allowed');
  }
}
