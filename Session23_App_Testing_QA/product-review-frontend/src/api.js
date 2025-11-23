const API_BASE_URL = 'http://localhost:4000/api';

export const api = {
  // Products
  getAllProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  getProduct: async id => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  },

  // Reviews
  getReviews: async productId => {
    const response = await fetch(`${API_BASE_URL}/reviews/${productId}`);
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return response.json();
  },

  createReview: async reviewData => {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.[0]?.msg || 'Failed to create review');
    }
    return response.json();
  },
};
