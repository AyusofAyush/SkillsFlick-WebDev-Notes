import express from 'express';
import { skills } from '../data/mockData.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * @route   GET /api/skills
 * @desc    Get all skills grouped by category
 * @access  Public
 */
router.get('/', asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    count: skills.length,
    data: skills
  });
}));

/**
 * @route   GET /api/skills/flat
 * @desc    Get all skills as a flat array
 * @access  Public
 */
router.get('/flat', asyncHandler(async (req, res) => {
  const flatSkills = skills.flatMap(category => 
    category.items.map(skill => ({
      ...skill,
      category: category.category
    }))
  );

  res.status(200).json({
    success: true,
    count: flatSkills.length,
    data: flatSkills
  });
}));

/**
 * @route   GET /api/skills/stats
 * @desc    Get skills statistics
 * @access  Public
 */
router.get('/stats', asyncHandler(async (req, res) => {
  const totalCategories = skills.length;
  const totalSkills = skills.reduce((sum, cat) => sum + cat.items.length, 0);
  
  const skillsByLevel = {
    Expert: 0,
    Advanced: 0,
    Intermediate: 0
  };

  skills.forEach(category => {
    category.items.forEach(skill => {
      if (skillsByLevel[skill.level] !== undefined) {
        skillsByLevel[skill.level]++;
      }
    });
  });

  const averageYears = skills.flatMap(cat => cat.items)
    .reduce((sum, skill) => sum + skill.years, 0) / totalSkills;

  res.status(200).json({
    success: true,
    data: {
      totalCategories,
      totalSkills,
      skillsByLevel,
      averageExperience: averageYears.toFixed(1)
    }
  });
}));

/**
 * @route   GET /api/skills/:category
 * @desc    Get skills by category
 * @access  Public
 */
router.get('/:category', asyncHandler(async (req, res) => {
  const categoryName = req.params.category;
  
  const skillCategory = skills.find(
    cat => cat.category.toLowerCase() === categoryName.toLowerCase()
  );

  if (!skillCategory) {
    throw new AppError(`Category '${categoryName}' not found`, 404);
  }

  res.status(200).json({
    success: true,
    data: skillCategory
  });
}));

export default router;
