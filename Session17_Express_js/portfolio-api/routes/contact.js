import express from 'express';
import { contactMessages, getNextContactId } from '../data/mockData.js';
import { validateContact } from '../middleware/validator.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * @route   POST /api/contact
 * @desc    Submit a contact form message
 * @access  Public
 */
router.post('/', validateContact, asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  const newMessage = {
    id: getNextContactId(),
    name,
    email,
    message,
    timestamp: new Date().toISOString(),
    status: 'unread'
  };

  contactMessages.push(newMessage);

  // In a real application, you would:
  // - Save to database
  // - Send email notification
  // - Queue for processing

  res.status(201).json({
    success: true,
    message: 'Thank you for your message! We will get back to you soon.',
    data: {
      id: newMessage.id,
      timestamp: newMessage.timestamp
    }
  });
}));

/**
 * @route   GET /api/contact/messages
 * @desc    Get all contact messages (admin only in production)
 * @access  Public (should be protected in production)
 */
router.get('/messages', asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    count: contactMessages.length,
    data: contactMessages
  });
}));

/**
 * @route   GET /api/contact/messages/:id
 * @desc    Get a specific contact message (admin only in production)
 * @access  Public (should be protected in production)
 */
router.get('/messages/:id', asyncHandler(async (req, res) => {
  const messageId = parseInt(req.params.id);
  const message = contactMessages.find(m => m.id === messageId);

  if (!message) {
    return res.status(404).json({
      success: false,
      message: `Message with ID ${messageId} not found`
    });
  }

  res.status(200).json({
    success: true,
    data: message
  });
}));

export default router;
