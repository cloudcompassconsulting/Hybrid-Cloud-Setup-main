// context/CartContext.js
import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage when the component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  const fetchProductDetails = async (productId) => {
    const response = await fetch(`/api/proxy?endpoint=products/${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch product details');
    }

    return await response.json();
  };

  const addToCart = async (product) => {
    const data = await fetchProductDetails(product.id);
    setCart((prevCart) => {
      const existingProduct = prevCart.find(item => item.id === product.id);
      if (existingProduct) {
        const updatedQuantity = existingProduct.quantity + 1;
        if (updatedQuantity > data.stock_quantity) {
          return prevCart;
        }
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: updatedQuantity } : item
        );
      } else {
        if (data.stock_quantity <= 0) {
          return prevCart;
        }
        return [...prevCart, { ...data, quantity: 1 }];
      }
    });
  };

  const updateQuantity = async (productId, quantity) => {
    const data = await fetchProductDetails(productId);
    setCart((prevCart) => {
      const product = prevCart.find(item => item.id === productId);
      if (!product) return prevCart;

      if (quantity > data.stock_quantity) {
        quantity = data.stock_quantity;
      }

      return prevCart.map(item =>
        item.id === productId ? { ...item, quantity: quantity > 0 ? quantity : 1 } : item
      );
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== productId));
  };

  const getTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0);

  const getTotalPrice = () => cart.reduce((sum, item) => sum + item.quantity * parseFloat(item.price), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, getTotalItems, getTotalPrice }}>
      {children}
    </CartContext.Provider>
  );
};
