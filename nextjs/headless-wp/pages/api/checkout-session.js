// pages/api/checkout-session.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { session_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    console.log('Fetched checkout session:', session); // Log the session data
    res.status(200).json(session);
  } catch (err) {
    console.error('Error fetching checkout session:', err);
    res.status(500).json({ error: err.message });
  }
}
