// pages/success.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Success = () => {
  const router = useRouter();
  const { session_id } = router.query;
  const [session, setSession] = useState(null);

  useEffect(() => {
    if (session_id) {
      console.log(`Fetching session with ID: ${session_id}`);
      fetch(`/api/checkout-session?session_id=${session_id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch checkout session');
          }
          return res.json();
        })
        .then((data) => {
          console.log('Fetched session data:', data); // Log session data
          setSession(data);
        })
        .catch((error) => console.error('Error fetching checkout session:', error));
    } else {
      console.log('No session_id found in query parameters');
    }
  }, [session_id]);

  const handleRegister = () => {
    if (session && session.customer_details && session.metadata && session.metadata.wooCommerceOrderId) {
      console.log('Redirecting to register with email and order ID:', session.customer_details.email, session.metadata.wooCommerceOrderId); // Log redirect info
      router.push(`/register?email=${session.customer_details.email}&order_id=${session.metadata.wooCommerceOrderId}`);
    } else {
      console.log('Missing session, customer details, or metadata for redirection'); // Log error if data is missing
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Thank You for Your Purchase!</h1>
      {session ? (
        <div>
          <p>We appreciate your business. If you have any questions, please email <a href="mailto:support@example.com">support@example.com</a>.</p>
          <h2>Order Summary</h2>
          <p><strong>Amount Paid:</strong> ${(session.amount_total / 100).toFixed(2)} USD</p>
          <p><strong>Payment Method:</strong> {session.payment_method_types[0]}</p>
          <h3>Next Steps</h3>
          <p>You will receive a confirmation email shortly.</p>
          <p>Need help? Visit our <a href="/support">support page</a> or contact us.</p>
          <button onClick={() => router.push('/')}>Continue Shopping</button>
          <button onClick={handleRegister}>Register</button>
        </div>
      ) : (
        <p>Loading order details...</p>
      )}
    </div>
  );
};

export default Success;
