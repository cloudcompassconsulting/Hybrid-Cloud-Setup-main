// pages/index.js
import { useContext, useEffect, useState } from 'react';
import { CartContext } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import Layout from '../components/Layout';

const Home = () => {
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/proxy?endpoint=products`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const products = await response.json();
        setProducts(products); // Directly set the products without filtering
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8">Product List</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
