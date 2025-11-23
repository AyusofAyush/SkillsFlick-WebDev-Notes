// Index Routes (Home, Templates)
const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const { isAuthenticated } = require('../middleware/auth');

// GET / - Home page
router.get('/', indexController.showHome);

// GET /templates - Show all templates
router.get('/templates', isAuthenticated, indexController.getAllTemplates);

// GET /templates/:id - Show single template
router.get('/templates/:id', isAuthenticated, indexController.getTemplate);

module.exports = router;
