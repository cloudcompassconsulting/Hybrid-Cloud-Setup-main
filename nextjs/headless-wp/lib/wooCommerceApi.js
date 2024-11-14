// lib/wooCommerceApi.js
const CACHE_KEY = 'product_cache';
const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour

export const fetchProductDetails = async (productId) => {
  try {
    const response = await fetch(`/api/proxy?endpoint=products/${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch product details');
    return await response.json();
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
};

export const fetchProducts = async () => {
  try {
    const cachedData = JSON.parse(localStorage.getItem(CACHE_KEY));
    const now = new Date().getTime();

    if (cachedData && cachedData.timestamp + CACHE_EXPIRY > now) {
      // Filter out products with zero stock
      return cachedData.products.filter(product => product.stock_quantity > 0);
    } else {
      const response = await fetch(`/api/proxy?endpoint=products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch products');

      const products = await response.json();

      // Filter out products with zero stock
      const filteredProducts = products.filter(product => product.stock_quantity > 0);

      localStorage.setItem(CACHE_KEY, JSON.stringify({
        products: filteredProducts,
        timestamp: new Date().getTime(),
      }));

      return filteredProducts;
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};
