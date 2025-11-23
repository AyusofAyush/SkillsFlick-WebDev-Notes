// Authentication Controller
const User = require('../models/User');
const Workspace = require('../models/Workspace');

// Show login page
exports.showLogin = (req, res) => {
  // If already logged in, redirect to home
  if (req.session.userId) {
    return res.redirect('/');
  }
  
  // Get validation errors from session
  const errors = req.session.errors || [];
  const oldInput = req.session.oldInput || {};
  
  // Clear session errors
  delete req.session.errors;
  delete req.session.oldInput;
  
  // Format errors for display
  const errorMessage = errors.length > 0 ? errors.map(e => e.msg).join(', ') : (req.query.error || null);
  
  res.render('auth/login', {
    pageTitle: 'Login - NoteMaster',
    error: errorMessage,
    oldInput,
    user: null
  });
};

// Handle login
exports.login = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Find user by username (case-insensitive)
    const user = await User.findOne({ username: username.toLowerCase() });
    
    if (!user) {
      return res.render('auth/login', {
        pageTitle: 'Login - NoteMaster',
        error: 'Invalid username or password',
        user: null
      });
    }
    
    // Compare password
    const isValidPassword = await user.comparePassword(password);
    
    if (!isValidPassword) {
      return res.render('auth/login', {
        pageTitle: 'Login - NoteMaster',
        error: 'Invalid username or password',
        user: null
      });
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Set session
    req.session.userId = user._id.toString();
    req.session.username = user.username;
    req.session.userRole = user.role;
    req.session.user = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      avatar: user.avatar,
      role: user.role
    };
    
    // Redirect to original page or home
    const returnTo = req.session.returnTo || '/workspaces';
    delete req.session.returnTo;
    res.redirect(returnTo);
    
  } catch (error) {
    console.error('Login error:', error);
    res.render('auth/login', {
      pageTitle: 'Login - NoteMaster',
      error: 'An error occurred during login',
      user: null
    });
  }
};

// Show registration page
exports.showRegister = (req, res) => {
  // If already logged in, redirect to home
  if (req.session.userId) {
    return res.redirect('/');
  }
  
  // Get validation errors from session
  const errors = req.session.errors || [];
  const oldInput = req.session.oldInput || {};
  
  // Clear session errors
  delete req.session.errors;
  delete req.session.oldInput;
  
  // Format errors for display
  const errorMessage = errors.length > 0 ? errors.map(e => e.msg).join(', ') : null;
  
  res.render('auth/register', {
    pageTitle: 'Register - NoteMaster',
    error: errorMessage,
    oldInput,
    user: null
  });
};

// Handle registration
exports.register = async (req, res) => {
  const { username, email, fullName, password, confirmPassword } = req.body;
  
  try {
    // Validate passwords match
    if (password !== confirmPassword) {
      return res.render('auth/register', {
        pageTitle: 'Register - NoteMaster',
        error: 'Passwords do not match',
        user: null
      });
    }
    
    // Check if username already exists
    const existingUsername = await User.findOne({ username: username.toLowerCase() });
    if (existingUsername) {
      return res.render('auth/register', {
        pageTitle: 'Register - NoteMaster',
        error: 'Username already exists',
        user: null
      });
    }
    
    // Check if email already exists
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.render('auth/register', {
        pageTitle: 'Register - NoteMaster',
        error: 'Email already exists',
        user: null
      });
    }
    
    // Create user (password will be hashed by the model's pre-save hook)
    const newUser = await User.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      fullName,
      password,
      avatar: '👤',
      role: 'user'
    });
    
    // Create default workspace for new user
    await Workspace.create({
      name: `${fullName}'s Workspace`,
      description: 'Your personal workspace',
      icon: '🏠',
      owner: newUser._id,
      members: [
        {
          user: newUser._id,
          role: 'owner'
        }
      ],
      isPublic: false
    });
    
    // Set session
    req.session.userId = newUser._id.toString();
    req.session.username = newUser.username;
    req.session.userRole = newUser.role;
    req.session.user = {
      id: newUser._id.toString(),
      username: newUser.username,
      email: newUser.email,
      fullName: newUser.fullName,
      avatar: newUser.avatar,
      role: newUser.role
    };
    
    res.redirect('/workspaces');
    
  } catch (error) {
    console.error('Registration error:', error);
    res.render('auth/register', {
      pageTitle: 'Register - NoteMaster',
      error: error.message || 'An error occurred during registration',
      user: null
    });
  }
};

// Handle logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/login');
  });
};
