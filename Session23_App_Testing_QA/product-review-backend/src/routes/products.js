const express = require('express');
const { body, param, validationResult } = require('express-validator');
const db = require('../db/database');

const router = express.Router();

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// GET /api/products - Get all products with stats
router.get('/', (req, res) => {
  const products = db.getAllProducts();
  const productsWithStats = products.map(product => ({
    ...product,
    stats: db.getProductStats(product.id),
  }));
  res.json(productsWithStats);
});

// GET /api/products/:id - Get single product with reviews
router.get('/:id', param('id').notEmpty(), validate, (req, res) => {
  const product = db.getProductById(req.params.id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const reviews = db.getReviewsByProductId(product.id);
  const stats = db.getProductStats(product.id);

  res.json({
    ...product,
    reviews,
    stats,
  });
});

// POST /api/products - Create new product
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Description is required'),
    body('price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('imageUrl').optional().isURL().withMessage('Invalid URL'),
  ],
  validate,
  (req, res) => {
    const product = db.createProduct(req.body);
    res.status(201).json(product);
  }
);

// PUT /api/products/:id - Update product
router.put(
  '/:id',
  [
    param('id').notEmpty(),
    body('name').optional().trim().notEmpty(),
    body('description').optional().trim().notEmpty(),
    body('price').optional().isFloat({ min: 0 }),
    body('category').optional().trim().notEmpty(),
    body('imageUrl').optional().isURL(),
  ],
  validate,
  (req, res) => {
    const product = db.updateProduct(req.params.id, req.body);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  }
);

// DELETE /api/products/:id - Delete product
router.delete('/:id', param('id').notEmpty(), validate, (req, res) => {
  const deleted = db.deleteProduct(req.params.id);

  if (!deleted) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.status(204).send();
});

module.exports = router;
