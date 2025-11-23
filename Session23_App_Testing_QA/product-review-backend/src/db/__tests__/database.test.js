const db = require('../database');

describe('ProductDatabase', () => {
  beforeEach(() => {
    db.reset();
  });

  describe('Product Operations', () => {
    describe('createProduct', () => {
      test('creates a new product with all fields', () => {
        const productData = {
          name: 'Test Product',
          description: 'Test Description',
          price: 99.99,
          category: 'Test',
          imageUrl: 'https://example.com/image.jpg',
        };

        const product = db.createProduct(productData);

        expect(product).toMatchObject(productData);
        expect(product.id).toBeDefined();
        expect(product.createdAt).toBeDefined();
      });

      test('generates unique IDs for products', () => {
        const product1 = db.createProduct({ name: 'Product 1', price: 10 });
        const product2 = db.createProduct({ name: 'Product 2', price: 20 });

        expect(product1.id).not.toBe(product2.id);
      });
    });

    describe('getAllProducts', () => {
      test('returns empty array when no products exist', () => {
        const products = db.getAllProducts();
        expect(products).toEqual([]);
      });

      test('returns all products', () => {
        db.createProduct({ name: 'Product 1', price: 10 });
        db.createProduct({ name: 'Product 2', price: 20 });

        const products = db.getAllProducts();
        expect(products).toHaveLength(2);
      });

      test('returns a copy of products array', () => {
        db.createProduct({ name: 'Product 1', price: 10 });
        const products1 = db.getAllProducts();
        const products2 = db.getAllProducts();

        expect(products1).not.toBe(products2);
        expect(products1).toEqual(products2);
      });
    });

    describe('getProductById', () => {
      test('returns product when ID exists', () => {
        const created = db.createProduct({ name: 'Test Product', price: 50 });
        const found = db.getProductById(created.id);

        expect(found).toEqual(created);
      });

      test('returns undefined when ID does not exist', () => {
        const found = db.getProductById('nonexistent-id');
        expect(found).toBeUndefined();
      });
    });

    describe('updateProduct', () => {
      test('updates product fields', () => {
        const product = db.createProduct({ name: 'Old Name', price: 10 });
        const updated = db.updateProduct(product.id, {
          name: 'New Name',
          price: 20,
        });

        expect(updated.name).toBe('New Name');
        expect(updated.price).toBe(20);
        expect(updated.id).toBe(product.id);
      });

      test('preserves ID and createdAt when updating', () => {
        const product = db.createProduct({ name: 'Test', price: 10 });
        const originalId = product.id;
        const originalCreatedAt = product.createdAt;

        const updated = db.updateProduct(product.id, { name: 'Updated' });

        expect(updated.id).toBe(originalId);
        expect(updated.createdAt).toBe(originalCreatedAt);
      });

      test('returns null when product does not exist', () => {
        const result = db.updateProduct('nonexistent-id', { name: 'Test' });
        expect(result).toBeNull();
      });
    });

    describe('deleteProduct', () => {
      test('deletes product and returns true', () => {
        const product = db.createProduct({ name: 'Test', price: 10 });
        const result = db.deleteProduct(product.id);

        expect(result).toBe(true);
        expect(db.getProductById(product.id)).toBeUndefined();
      });

      test('deletes associated reviews when product is deleted', () => {
        const product = db.createProduct({ name: 'Test', price: 10 });
        db.createReview({
          productId: product.id,
          userName: 'User',
          rating: 5,
          comment: 'Great',
        });

        db.deleteProduct(product.id);
        const reviews = db.getReviewsByProductId(product.id);

        expect(reviews).toHaveLength(0);
      });

      test('returns false when product does not exist', () => {
        const result = db.deleteProduct('nonexistent-id');
        expect(result).toBe(false);
      });
    });
  });

  describe('Review Operations', () => {
    let testProduct;

    beforeEach(() => {
      testProduct = db.createProduct({ name: 'Test Product', price: 50 });
    });

    describe('createReview', () => {
      test('creates a new review with all fields', () => {
        const reviewData = {
          productId: testProduct.id,
          userName: 'John Doe',
          rating: 5,
          comment: 'Excellent product!',
        };

        const review = db.createReview(reviewData);

        expect(review).toMatchObject(reviewData);
        expect(review.id).toBeDefined();
        expect(review.createdAt).toBeDefined();
      });
    });

    describe('getReviewsByProductId', () => {
      test('returns empty array when no reviews exist', () => {
        const reviews = db.getReviewsByProductId(testProduct.id);
        expect(reviews).toEqual([]);
      });

      test('returns only reviews for specific product', () => {
        const product2 = db.createProduct({ name: 'Product 2', price: 30 });

        db.createReview({
          productId: testProduct.id,
          userName: 'User1',
          rating: 5,
          comment: 'Great',
        });
        db.createReview({
          productId: product2.id,
          userName: 'User2',
          rating: 4,
          comment: 'Good',
        });

        const reviews = db.getReviewsByProductId(testProduct.id);

        expect(reviews).toHaveLength(1);
        expect(reviews[0].productId).toBe(testProduct.id);
      });
    });

    describe('deleteReview', () => {
      test('deletes review and returns true', () => {
        const review = db.createReview({
          productId: testProduct.id,
          userName: 'User',
          rating: 5,
          comment: 'Test',
        });

        const result = db.deleteReview(review.id);

        expect(result).toBe(true);
        expect(db.getReviewById(review.id)).toBeUndefined();
      });

      test('returns false when review does not exist', () => {
        const result = db.deleteReview('nonexistent-id');
        expect(result).toBe(false);
      });
    });
  });

  describe('Product Statistics', () => {
    let testProduct;

    beforeEach(() => {
      testProduct = db.createProduct({ name: 'Test Product', price: 50 });
    });

    describe('getProductStats', () => {
      test('returns zero stats when no reviews exist', () => {
        const stats = db.getProductStats(testProduct.id);

        expect(stats).toEqual({
          averageRating: 0,
          totalReviews: 0,
        });
      });

      test('calculates average rating correctly', () => {
        db.createReview({
          productId: testProduct.id,
          userName: 'User1',
          rating: 5,
          comment: 'Excellent',
        });
        db.createReview({
          productId: testProduct.id,
          userName: 'User2',
          rating: 3,
          comment: 'Average',
        });

        const stats = db.getProductStats(testProduct.id);

        expect(stats.averageRating).toBe(4.0);
        expect(stats.totalReviews).toBe(2);
      });

      test('rounds average rating to one decimal place', () => {
        db.createReview({
          productId: testProduct.id,
          userName: 'User1',
          rating: 5,
          comment: 'Great',
        });
        db.createReview({
          productId: testProduct.id,
          userName: 'User2',
          rating: 4,
          comment: 'Good',
        });
        db.createReview({
          productId: testProduct.id,
          userName: 'User3',
          rating: 4,
          comment: 'Nice',
        });

        const stats = db.getProductStats(testProduct.id);

        expect(stats.averageRating).toBe(4.3);
      });
    });
  });
});
