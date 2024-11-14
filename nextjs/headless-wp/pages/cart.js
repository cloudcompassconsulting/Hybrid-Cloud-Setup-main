// pages/cart.js
import { useContext, useEffect, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const Cart = () => {
  const { cart, getTotalItems, getTotalPrice } = useContext(CartContext);
  const [clientSide, setClientSide] = useState(false);

  useEffect(() => {
    setClientSide(true);
  }, []);

  const handleCheckout = async () => {
    const stripe = await stripePromise;

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            id: item.id,
          })),
          success_url: window.location.origin + '/success',
          cancel_url: window.location.origin + '/cancel',
        }),
      });

      if (!response.ok) throw new Error('Failed to create checkout session');

      const { id } = await response.json();

      const { error } = await stripe.redirectToCheckout({
        sessionId: id,
      });

      if (error) console.error(error);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!clientSide) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8">Your Cart</h1>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {cart.map((item, index) => (
                <ProductCard key={index} product={item} isCartItem />
              ))}
            </div>
            <h2 className="text-2xl font-bold mt-8">Total Items: {getTotalItems()}</h2>
            <h2 className="text-2xl font-bold mb-8">Total Price: ${getTotalPrice().toFixed(2)}</h2>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
