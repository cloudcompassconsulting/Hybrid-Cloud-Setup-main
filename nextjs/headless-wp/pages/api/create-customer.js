// pages/api/create-customer.js
import woocommerce from '../../lib/woocommerce';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, first_name, last_name, username, password, billing, shipping } = req.body;

    const data = {
      email,
      first_name,
      last_name,
      username,
      password,
      billing,
      shipping,
    };

    try {
      const response = await woocommerce.post('customers', data);

      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: error.response ? error.response.data : error.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
