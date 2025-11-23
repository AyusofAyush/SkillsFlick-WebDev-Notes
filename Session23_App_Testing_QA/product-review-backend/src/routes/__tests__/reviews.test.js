const request = require('supertest');
const app = require('../../app');
const db = require('../../db/database');

describe('Reviews API', () => {
  let testProduct;

  beforeEach(() => {
    db.reset();
    testProduct = db.createProduct({
      name: 'Test Product',
      description: 'Test Description',
      price: 99.99,
      category: 'Test',
    });
  });

  describe('GET /api/reviews/:productId', () => {
    test('returns empty array when no reviews exist', async () => {
      const response = await request(app).get(`/api/reviews/${testProduct.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    test('returns all reviews for a product', async () => {
      db.createReview({
        productId: testProduct.id,
        userName: 'User1',
        rating: 5,
        comment: 'Excellent',
      });
      db.createReview({
        productId: testProduct.id,
        userName: 'User2',
        rating: 4,
        comment: 'Good',
      });

      const response = await request(app).get(`/api/reviews/${testProduct.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].productId).toBe(testProduct.id);
    });

    test('returns only reviews for specified product', async () => {
      const product2 = db.createProduct({
        name: 'Product 2',
        description: 'Test',
        price: 50,
        category: 'Test',
      });

      db.createReview({
        productId: testProduct.id,
        userName: 'User1',
        rating: 5,
        comment: 'Great',
      });
      db.createReview({
        productId: product2.id,
        userName: 'User2',
        rating: 3,
        comment: 'OK',
      });

      const response = await request(app).get(`/api/reviews/${testProduct.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].productId).toBe(testProduct.id);
    });

    test('returns 404 when product does not exist', async () => {
      const response = await request(app).get('/api/reviews/nonexistent-id');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Product not found' });
    });
  });

  describe('POST /api/reviews', () => {
    test('creates a new review with valid data', async () => {
      const reviewData = {
        productId: testProduct.id,
        userName: 'John Doe',
        rating: 5,
        comment: 'Amazing product!',
      };

      const response = await request(app).post('/api/reviews').send(reviewData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(reviewData);
      expect(response.body.id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
    });

    test('returns 404 when product does not exist', async () => {
      const reviewData = {
        productId: 'nonexistent-id',
        userName: 'John Doe',
        rating: 5,
        comment: 'Test',
      };

      const response = await request(app).post('/api/reviews').send(reviewData);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Product not found' });
    });

    test('returns 400 when userName is missing', async () => {
      const response = await request(app).post('/api/reviews').send({
        productId: testProduct.id,
        rating: 5,
        comment: 'Test',
      });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].msg).toBe('User name is required');
    });

    test('returns 400 when rating is missing', async () => {
      const response = await request(app).post('/api/reviews').send({
        productId: testProduct.id,
        userName: 'User',
        comment: 'Test',
      });

      expect(response.status).toBe(400);
      expect(response.body.errors[0].msg).toBe(
        'Rating must be between 1 and 5'
      );
    });

    test('returns 400 when rating is less than 1', async () => {
      const response = await request(app).post('/api/reviews').send({
        productId: testProduct.id,
        userName: 'User',
        rating: 0,
        comment: 'Test',
      });

      expect(response.status).toBe(400);
      expect(response.body.errors[0].msg).toBe(
        'Rating must be between 1 and 5'
      );
    });

    test('returns 400 when rating is greater than 5', async () => {
      const response = await request(app).post('/api/reviews').send({
        productId: testProduct.id,
        userName: 'User',
        rating: 6,
        comment: 'Test',
      });

      expect(response.status).toBe(400);
      expect(response.body.errors[0].msg).toBe(
        'Rating must be between 1 and 5'
      );
    });

    test('returns 400 when rating is not an integer', async () => {
      const response = await request(app).post('/api/reviews').send({
        productId: testProduct.id,
        userName: 'User',
        rating: 3.5,
        comment: 'Test',
      });

      expect(response.status).toBe(400);
    });

    test('returns 400 when comment is missing', async () => {
      const response = await request(app).post('/api/reviews').send({
        productId: testProduct.id,
        userName: 'User',
        rating: 5,
      });

      expect(response.status).toBe(400);
      expect(response.body.errors[0].msg).toBe('Comment is required');
    });

    test('trims whitespace from userName and comment', async () => {
      const response = await request(app).post('/api/reviews').send({
        productId: testProduct.id,
        userName: '  John Doe  ',
        rating: 5,
        comment: '  Great product!  ',
      });

      expect(response.status).toBe(201);
      expect(response.body.userName).toBe('John Doe');
      expect(response.body.comment).toBe('Great product!');
    });

    test('accepts all valid ratings (1-5)', async () => {
      for (let rating = 1; rating <= 5; rating++) {
        const response = await request(app)
          .post('/api/reviews')
          .send({
            productId: testProduct.id,
            userName: 'User',
            rating,
            comment: `Rating ${rating}`,
          });

        expect(response.status).toBe(201);
        expect(response.body.rating).toBe(rating);
      }
    });
  });

  describe('DELETE /api/reviews/:id', () => {
    test('deletes review and returns 204', async () => {
      const review = db.createReview({
        productId: testProduct.id,
        userName: 'User',
        rating: 5,
        comment: 'Test',
      });

      const response = await request(app).delete(`/api/reviews/${review.id}`);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});

      // Verify review is deleted
      expect(db.getReviewById(review.id)).toBeUndefined();
    });

    test('returns 404 when review does not exist', async () => {
      const response = await request(app).delete('/api/reviews/nonexistent-id');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Review not found' });
    });
  });
});
