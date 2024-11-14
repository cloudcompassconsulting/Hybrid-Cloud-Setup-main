// pages/cancel.js
import Link from 'next/link';
import Layout from '../components/Layout';

const Cancel = () => {
  return (
    <Layout>
      <div className="container mx-auto text-center mt-10">
        <h1 className="text-3xl font-bold mb-4">Payment Canceled</h1>
        <p className="mb-8">Your payment was not successful. Please try again.</p>
        <Link href="/">
          <a className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">Continue Shopping</a>
        </Link>
      </div>
    </Layout>
  );
};

export default Cancel;
