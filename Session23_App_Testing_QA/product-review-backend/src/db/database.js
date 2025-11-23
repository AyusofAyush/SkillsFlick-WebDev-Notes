const { v4: uuidv4 } = require('uuid');

// In-memory data store
let products = [
  {
    id: '1',
    name: 'Laptop Pro 15',
    description: 'High-performance laptop for professionals',
    price: 1299,
    category: 'Electronics',
    imageUrl:
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop',
    createdAt: new Date('2025-11-20').toISOString(),
  },
  {
    id: '2',
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with precision tracking',
    price: 299,
    category: 'Electronics',
    imageUrl:
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=200&fit=crop',
    createdAt: new Date('2025-11-21').toISOString(),
  },
  {
    id: '3',
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard with cherry switches',
    price: 899,
    category: 'Electronics',
    imageUrl:
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&h=200&fit=crop',
    createdAt: new Date('2025-11-22').toISOString(),
  },
  {
    id: '4',
    name: 'USB-C Hub',
    description: '7-in-1 USB-C hub with multiple ports',
    price: 499,
    category: 'Accessories',
    imageUrl:
      'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=300&h=200&fit=crop',
    createdAt: new Date('2025-11-23').toISOString(),
  },
];

let reviews = [
  {
    id: '1',
    productId: '1',
    userName: 'Ayush Raj',
    rating: 5,
    comment: 'Excellent laptop! Fast and reliable.',
    createdAt: new Date('2025-11-21').toISOString(),
  },
  {
    id: '2',
    productId: '1',
    userName: 'Jane Smith',
    rating: 4,
    comment: 'Great performance but a bit pricey.',
    createdAt: new Date('2025-11-22').toISOString(),
  },
  {
    id: '3',
    productId: '2',
    userName: 'Bob Johnson',
    rating: 5,
    comment: 'Very comfortable mouse, highly recommended!',
    createdAt: new Date('2025-11-22').toISOString(),
  },
];

class ProductDatabase {
  // Product methods
  getAllProducts() {
    return [...products];
  }

  getProductById(id) {
    return products.find(p => p.id === id);
  }

  createProduct(productData) {
    const newProduct = {
      id: uuidv4(),
      ...productData,
      createdAt: new Date().toISOString(),
    };
    products.push(newProduct);
    return newProduct;
  }

  updateProduct(id, updates) {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    products[index] = {
      ...products[index],
      ...updates,
      id: products[index].id,
      createdAt: products[index].createdAt,
    };
    return products[index];
  }

  deleteProduct(id) {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return false;

    products.splice(index, 1);
    // Also delete related reviews
    reviews = reviews.filter(r => r.productId !== id);
    return true;
  }

  // Review methods
  getReviewsByProductId(productId) {
    return reviews.filter(r => r.productId === productId);
  }

  getReviewById(id) {
    return reviews.find(r => r.id === id);
  }

  createReview(reviewData) {
    const newReview = {
      id: uuidv4(),
      ...reviewData,
      createdAt: new Date().toISOString(),
    };
    reviews.push(newReview);
    return newReview;
  }

  deleteReview(id) {
    const index = reviews.findIndex(r => r.id === id);
    if (index === -1) return false;

    reviews.splice(index, 1);
    return true;
  }

  // Utility methods for testing
  reset() {
    products = [];
    reviews = [];
  }

  getProductStats(productId) {
    const productReviews = this.getReviewsByProductId(productId);
    if (productReviews.length === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }

    const totalRating = productReviews.reduce((sum, r) => sum + r.rating, 0);
    return {
      averageRating: parseFloat(
        (totalRating / productReviews.length).toFixed(1)
      ),
      totalReviews: productReviews.length,
    };
  }
}

module.exports = new ProductDatabase();
