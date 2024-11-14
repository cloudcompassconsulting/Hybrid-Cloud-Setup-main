// lib/stockValidation.js
export const validateStock = async (productId, requestedQuantity) => {
  try {
    console.log(`Validating stock for product ID: ${productId}`);
    
    const response = await fetch(`/api/proxy?endpoint=products/${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch product details');
      throw new Error('Failed to fetch product details');
    }

    const data = await response.json();
    const availableStock = data.stock_quantity;

    console.log(`Product ID: ${productId}, Stock Quantity: ${availableStock}, Requested Quantity: ${requestedQuantity}`);

    // Check if the product is out of stock or has a negative stock quantity
    if (data.stock_status === 'outofstock' || availableStock <= 0) {
      console.log(`Product ID: ${productId} is out of stock.`);
      return { valid: false, product: data };
    }

    if (requestedQuantity <= availableStock) {
      return { valid: true, product: data };
    } else {
      return { valid: false, product: data };
    }
  } catch (error) {
    console.error('Error validating stock:', error);
    return { valid: false, error };
  }
};
