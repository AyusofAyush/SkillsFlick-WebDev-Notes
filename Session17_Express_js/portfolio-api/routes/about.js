import express from 'express';
import { about } from '../data/mockData.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * @route   GET /api/about
 * @desc    Get complete about information
 * @access  Public
 */
router.get('/', asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: about
  });
}));

/**
 * @route   GET /api/about/basic
 * @desc    Get basic about information (name, title, bio)
 * @access  Public
 */
router.get('/basic', asyncHandler(async (req, res) => {
  const { name, title, bio } = about;
  
  res.status(200).json({
    success: true,
    data: { name, title, bio }
  });
}));

/**
 * @route   GET /api/about/contact
 * @desc    Get contact information only
 * @access  Public
 */
router.get('/contact', asyncHandler(async (req, res) => {
  const { email, phone, location, social } = about;
  
  res.status(200).json({
    success: true,
    data: { email, phone, location, social }
  });
}));

/**
 * @route   GET /api/about/experience
 * @desc    Get work experience
 * @access  Public
 */
router.get('/experience', asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    count: about.experience.length,
    data: about.experience
  });
}));

/**
 * @route   GET /api/about/education
 * @desc    Get education information
 * @access  Public
 */
router.get('/education', asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    count: about.education.length,
    data: about.education
  });
}));

/**
 * @route   GET /api/about/achievements
 * @desc    Get achievements list
 * @access  Public
 */
router.get('/achievements', asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    count: about.achievements.length,
    data: about.achievements
  });
}));

export default router;
