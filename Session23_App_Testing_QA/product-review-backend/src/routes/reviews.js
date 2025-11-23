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

// GET /api/reviews/:productId - Get all reviews for a product
router.get(
  '/:productId',
  param('productId').notEmpty(),
  validate,
  (req, res) => {
    const product = db.getProductById(req.params.productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const reviews = db.getReviewsByProductId(req.params.productId);
    res.json(reviews);
  }
);

// POST /api/reviews - Create new review
router.post(
  '/',
  [
    body('productId').notEmpty().withMessage('Product ID is required'),
    body('userName').trim().notEmpty().withMessage('User name is required'),
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('comment').trim().notEmpty().withMessage('Comment is required'),
  ],
  validate,
  (req, res) => {
    // Check if product exists
    const product = db.getProductById(req.body.productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const review = db.createReview(req.body);
    res.status(201).json(review);
  }
);

// DELETE /api/reviews/:id - Delete review
router.delete('/:id', param('id').notEmpty(), validate, (req, res) => {
  const deleted = db.deleteReview(req.params.id);

  if (!deleted) {
    return res.status(404).json({ error: 'Review not found' });
  }

  res.status(204).send();
});

module.exports = router;
