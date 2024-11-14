// components/ProductCard.js
import Image from 'next/image';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product, isCartItem }) => {
  const { addToCart, updateQuantity, removeFromCart } = useContext(CartContext);

  const cartItem = isCartItem ? product : null;
  const availableStock = product.stock_quantity - (cartItem ? cartItem.quantity : 0);

  return (
    <div className="border p-4 rounded shadow-lg">
      {product.images[0]?.src ? (
        <Image
          src={product.images[0].src}
          alt={product.name}
          width={400}
          height={300}
          layout="responsive"
          objectFit="contain"
          className="mb-4"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 mb-4"></div>
      )}
      <h2 className="text-xl font-bold mb-2">{product.name}</h2>
      <p className="text-lg mb-4">${product.price}</p>

      {/* Make product information very prominent */}
      <div className="bg-red-500 text-white p-4 rounded mb-4 text-center text-2xl">
        <p><strong>Stock Quantity:</strong> {product.stock_quantity}</p>
        <p><strong>Stock Status:</strong> {product.stock_status}</p>
        <p><strong>Product ID:</strong> {product.id}</p>
        <p><strong>SKU:</strong> {product.sku}</p>
      </div>

      {isCartItem ? (
        <div className="flex items-center space-x-4">
          <button onClick={() => updateQuantity(product.id, product.quantity - 1)}>-</button>
          <span>{product.quantity}</span>
          <button onClick={() => updateQuantity(product.id, product.quantity + 1)} disabled={product.quantity >= product.stock_quantity}>+</button>
          <button onClick={() => removeFromCart(product.id)}>🗑️</button>
        </div>
      ) : (
        <div>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
            onClick={() => addToCart(product)}
            disabled={availableStock <= 0}
          >
            {availableStock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
