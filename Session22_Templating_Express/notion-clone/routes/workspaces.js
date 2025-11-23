// Workspace Routes
const express = require('express');
const router = express.Router();
const workspaceController = require('../controllers/workspaceController');
const { isAuthenticated, canAccessWorkspace, canModifyWorkspace } = require('../middleware/auth');
const { validateWorkspace, validateId } = require('../middleware/validation');

// GET /workspaces - Show all workspaces
router.get('/', isAuthenticated, workspaceController.getAllWorkspaces);

// GET /workspaces/new - Show create workspace form
router.get('/new', isAuthenticated, workspaceController.showCreateForm);

// POST /workspaces - Create new workspace
router.post('/', isAuthenticated, validateWorkspace, workspaceController.createWorkspace);

// GET /workspaces/:id - Show single workspace
router.get('/:id', isAuthenticated, canAccessWorkspace, workspaceController.getWorkspace);

// GET /workspaces/:id/edit - Show edit workspace form
router.get('/:id/edit', isAuthenticated, canModifyWorkspace, workspaceController.showEditForm);

// POST /workspaces/:id - Update workspace
router.post('/:id', isAuthenticated, canModifyWorkspace, validateWorkspace, workspaceController.updateWorkspace);

// POST /workspaces/:id/delete - Delete workspace
router.post('/:id/delete', isAuthenticated, canModifyWorkspace, workspaceController.deleteWorkspace);

module.exports = router;
