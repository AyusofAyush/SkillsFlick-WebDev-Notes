// Authentication Routes
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateLogin, validateRegister } = require('../middleware/validation');

// GET /login - Show login form
router.get('/login', authController.showLogin);

// POST /login - Handle login
router.post('/login', validateLogin, authController.login);

// GET /register - Show registration form
router.get('/register', authController.showRegister);

// POST /register - Handle registration
router.post('/register', validateRegister, authController.register);

// GET /logout - Handle logout
router.get('/logout', authController.logout);

module.exports = router;
