// pages/api/create-woocommerce-order.js
import woocommerce from '../../lib/woocommerce';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { customer, cart } = req.body;

    const data = {
      payment_method: "stripe",
      payment_method_title: "Credit Card",
      set_paid: false,
      billing: {
        first_name: customer.firstName,
        last_name: customer.lastName,
        address_1: customer.address1,
        address_2: customer.address2,
        city: customer.city,
        state: customer.state,
        postcode: customer.postcode,
        country: customer.country,
        email: customer.email,
        phone: customer.phone,
      },
      shipping: {
        first_name: customer.firstName,
        last_name: customer.lastName,
        address_1: customer.address1,
        address_2: customer.address2,
        city: customer.city,
        state: customer.state,
        postcode: customer.postcode,
        country: customer.country,
      },
      line_items: cart.map(product => ({
        product_id: product.id,
        quantity: product.quantity
      })),
    };

    try {
      console.log('Sending data to WooCommerce Proxy:', data);

      const response = await woocommerce.post('orders', data);

      console.log('WooCommerce Proxy response:', response.data);
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Error creating WooCommerce order:', error.message);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
