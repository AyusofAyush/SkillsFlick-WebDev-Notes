const request = require('supertest');
const app = require('../../app');
const db = require('../../db/database');

describe('Products API', () => {
  beforeEach(() => {
    db.reset();
  });

  describe('GET /api/products', () => {
    test('returns empty array when no products exist', async () => {
      const response = await request(app).get('/api/products');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    test('returns all products with stats', async () => {
      const product = db.createProduct({
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        category: 'Test',
      });

      db.createReview({
        productId: product.id,
        userName: 'User1',
        rating: 5,
        comment: 'Great',
      });

      const response = await request(app).get('/api/products');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject({
        id: product.id,
        name: 'Test Product',
        stats: {
          averageRating: 5,
          totalReviews: 1,
        },
      });
    });
  });

  describe('GET /api/products/:id', () => {
    test('returns product with reviews and stats', async () => {
      const product = db.createProduct({
        name: 'Test Product',
        description: 'Test',
        price: 50,
        category: 'Test',
      });

      db.createReview({
        productId: product.id,
        userName: 'User1',
        rating: 4,
        comment: 'Good',
      });

      const response = await request(app).get(`/api/products/${product.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: product.id,
        name: 'Test Product',
      });
      expect(response.body.reviews).toHaveLength(1);
      expect(response.body.stats).toEqual({
        averageRating: 4,
        totalReviews: 1,
      });
    });

    test('returns 404 when product does not exist', async () => {
      const response = await request(app).get('/api/products/nonexistent-id');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Product not found' });
    });

    test('returns all products when ID is empty (GET /api/products/)', async () => {
      const response = await request(app).get('/api/products/');

      // This actually matches the GET /api/products route
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/products', () => {
    test('creates a new product with valid data', async () => {
      const productData = {
        name: 'New Product',
        description: 'New Description',
        price: 149.99,
        category: 'Electronics',
        imageUrl: 'https://example.com/image.jpg',
      };

      const response = await request(app)
        .post('/api/products')
        .send(productData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(productData);
      expect(response.body.id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
    });

    test('creates product without optional imageUrl', async () => {
      const productData = {
        name: 'New Product',
        description: 'New Description',
        price: 99.99,
        category: 'Test',
      };

      const response = await request(app)
        .post('/api/products')
        .send(productData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(productData);
    });

    test('returns 400 when name is missing', async () => {
      const response = await request(app).post('/api/products').send({
        description: 'Test',
        price: 50,
        category: 'Test',
      });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].msg).toBe('Name is required');
    });

    test('returns 400 when price is negative', async () => {
      const response = await request(app).post('/api/products').send({
        name: 'Test',
        description: 'Test',
        price: -10,
        category: 'Test',
      });

      expect(response.status).toBe(400);
      expect(response.body.errors[0].msg).toBe(
        'Price must be a positive number'
      );
    });

    test('returns 400 when price is not a number', async () => {
      const response = await request(app).post('/api/products').send({
        name: 'Test',
        description: 'Test',
        price: 'not-a-number',
        category: 'Test',
      });

      expect(response.status).toBe(400);
    });

    test('returns 400 for invalid imageUrl', async () => {
      const response = await request(app).post('/api/products').send({
        name: 'Test',
        description: 'Test',
        price: 50,
        category: 'Test',
        imageUrl: 'not-a-url',
      });

      expect(response.status).toBe(400);
      expect(response.body.errors[0].msg).toBe('Invalid URL');
    });

    test('trims whitespace from name and description', async () => {
      const response = await request(app).post('/api/products').send({
        name: '  Trimmed Product  ',
        description: '  Trimmed Description  ',
        price: 50,
        category: '  Test  ',
      });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Trimmed Product');
      expect(response.body.description).toBe('Trimmed Description');
      expect(response.body.category).toBe('Test');
    });
  });

  describe('PUT /api/products/:id', () => {
    test('updates product successfully', async () => {
      const product = db.createProduct({
        name: 'Old Name',
        description: 'Old Description',
        price: 50,
        category: 'Old',
      });

      const response = await request(app)
        .put(`/api/products/${product.id}`)
        .send({
          name: 'New Name',
          price: 75,
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('New Name');
      expect(response.body.price).toBe(75);
      expect(response.body.description).toBe('Old Description');
    });

    test('returns 404 when product does not exist', async () => {
      const response = await request(app)
        .put('/api/products/nonexistent-id')
        .send({ name: 'Test' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Product not found' });
    });

    test('returns 400 for invalid price', async () => {
      const product = db.createProduct({
        name: 'Test',
        description: 'Test',
        price: 50,
        category: 'Test',
      });

      const response = await request(app)
        .put(`/api/products/${product.id}`)
        .send({ price: -10 });

      expect(response.status).toBe(400);
    });

    test('validates imageUrl when provided', async () => {
      const product = db.createProduct({
        name: 'Test',
        description: 'Test',
        price: 50,
        category: 'Test',
      });

      const response = await request(app)
        .put(`/api/products/${product.id}`)
        .send({ imageUrl: 'not-a-url' });

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/products/:id', () => {
    test('deletes product and returns 204', async () => {
      const product = db.createProduct({
        name: 'Test',
        description: 'Test',
        price: 50,
        category: 'Test',
      });

      const response = await request(app).delete(`/api/products/${product.id}`);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});

      // Verify product is deleted
      const checkResponse = await request(app).get(
        `/api/products/${product.id}`
      );
      expect(checkResponse.status).toBe(404);
    });

    test('deletes associated reviews when product is deleted', async () => {
      const product = db.createProduct({
        name: 'Test',
        description: 'Test',
        price: 50,
        category: 'Test',
      });

      const review = db.createReview({
        productId: product.id,
        userName: 'User',
        rating: 5,
        comment: 'Test',
      });

      await request(app).delete(`/api/products/${product.id}`);

      // Verify review is deleted
      expect(db.getReviewById(review.id)).toBeUndefined();
    });

    test('returns 404 when product does not exist', async () => {
      const response = await request(app).delete(
        '/api/products/nonexistent-id'
      );

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Product not found' });
    });
  });
});
