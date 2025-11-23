// Page Routes
const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams to access workspaceId
const pageController = require('../controllers/pageController');
const { isAuthenticated, canAccessWorkspace } = require('../middleware/auth');
const { validatePage } = require('../middleware/validation');

// All routes require authentication and workspace access
router.use(isAuthenticated);
router.use(canAccessWorkspace);

// GET /workspaces/:workspaceId/pages/search - Search pages
router.get('/search', pageController.searchPages);

// GET /workspaces/:workspaceId/pages/new - Show create page form
router.get('/new', pageController.showCreateForm);

// POST /workspaces/:workspaceId/pages - Create new page
router.post('/', validatePage, pageController.createPage);

// GET /workspaces/:workspaceId/pages/:id - Show single page
router.get('/:id', pageController.getPage);

// GET /workspaces/:workspaceId/pages/:id/edit - Show edit page form
router.get('/:id/edit', pageController.showEditForm);

// POST /workspaces/:workspaceId/pages/:id - Update page
router.post('/:id', validatePage, pageController.updatePage);

// POST /workspaces/:workspaceId/pages/:id/favorite - Toggle favorite
router.post('/:id/favorite', pageController.toggleFavorite);

// POST /workspaces/:workspaceId/pages/:id/delete - Delete page
router.post('/:id/delete', pageController.deletePage);

module.exports = router;
