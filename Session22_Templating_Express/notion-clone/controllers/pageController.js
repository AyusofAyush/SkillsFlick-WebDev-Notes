// Page Controller
const Page = require('../models/Page');
const Workspace = require('../models/Workspace');
const Template = require('../models/Template');

// Show single page
exports.getPage = async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    const pageId = req.params.id;
    
    const workspace = await Workspace.findById(workspaceId).lean();
    const page = await Page.findById(pageId)
      .populate('author', 'fullName avatar')
      .populate('lastEditedBy', 'fullName avatar')
      .lean();
    
    if (!workspace || !page) {
      return res.status(404).render('404', {
        title: 'Page Not Found',
        user: req.session.user
      });
    }
    
    // Check if page belongs to workspace
    if (page.workspace.toString() !== workspaceId) {
      return res.status(404).render('404', {
        title: 'Page Not Found',
        user: req.session.user
      });
    }
    
    // Add id fields
    workspace.id = workspace._id.toString();
    page.id = page._id.toString();
    
    // Get child pages
    const childPages = await Page.find({ parentPage: pageId }).lean();
    const childPagesWithId = childPages.map(p => ({ ...p, id: p._id.toString() }));
    
    // Get parent page if exists
    const parentPage = page.parentPage ? await Page.findById(page.parentPage).lean() : null;
    if (parentPage) {
      parentPage.id = parentPage._id.toString();
    }
    
    // Get breadcrumb trail
    const breadcrumbs = await buildBreadcrumbs(page);
    
    // Get page tree for sidebar and favorites
    const pageTree = await buildPageTree(workspaceId);
    const favoritePages = await Page.find({ workspace: workspaceId, isFavorite: true }).lean();
    const favoritePagesWithId = favoritePages.map(p => ({ ...p, id: p._id.toString() }));
    
    res.render('pages/show', {
      title: `${page.title} - NoteMaster`,
      workspace,
      page,
      childPages: childPagesWithId,
      parentPage,
      breadcrumbs,
      pageTree,
      favoritePages: favoritePagesWithId,
      blocks: [], // Blocks feature not yet implemented
      user: req.session.user
    });
  } catch (error) {
    console.error('Get page error:', error);
    res.status(500).render('error', {
      title: 'Error',
      errorMessage: 'Failed to load page',
      errorCode: 500,
      user: req.session.user
    });
  }
};

// Show create page form
exports.showCreateForm = async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    const parentPageId = req.query.parent || null;
    const templateId = req.query.templateId || null;
    
    const workspace = await Workspace.findById(workspaceId).lean();
    
    if (!workspace) {
      return res.status(404).render('404', {
        title: 'Workspace Not Found',
        user: req.session.user
      });
    }
    
    workspace.id = workspace._id.toString();
    
    let parentPage = null;
    if (parentPageId) {
      parentPage = await Page.findById(parentPageId).lean();
      if (parentPage) {
        parentPage.id = parentPage._id.toString();
      }
    }
    
    // Get templates
    const templates = await Template.find({ isPublic: true }).lean();
    const templatesWithId = templates.map(t => ({ ...t, id: t._id.toString() }));
    
    // Get selected template if provided
    let selectedTemplate = null;
    if (templateId) {
      selectedTemplate = await Template.findById(templateId).lean();
      if (selectedTemplate) {
        selectedTemplate.id = selectedTemplate._id.toString();
      }
    }
    
    // Get page tree for sidebar and favorites
    const pageTree = await buildPageTree(workspaceId);
    const favoritePages = await Page.find({ workspace: workspaceId, isFavorite: true }).lean();
    const favoritePagesWithId = favoritePages.map(p => ({ ...p, id: p._id.toString() }));
    
    res.render('pages/new', {
      title: 'Create Page - NoteMaster',
      workspace,
      parentPage,
      templates: templatesWithId,
      selectedTemplate,
      pageTree,
      favoritePages: favoritePagesWithId,
      user: req.session.user
    });
  } catch (error) {
    console.error('Show create form error:', error);
    res.status(500).render('error', {
      title: 'Error',
      errorMessage: 'Failed to load create form',
      errorCode: 500,
      user: req.session.user
    });
  }
};

// Create new page
exports.createPage = async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    const { title, icon, content, parentPageId, templateId } = req.body;
    const userId = req.session.userId;
    
    let pageContent = content || '';
    
    // If template is selected, use template content
    if (templateId) {
      const template = await Template.findById(templateId);
      if (template) {
        pageContent = template.content;
        // Increment usage count
        await Template.findByIdAndUpdate(templateId, { $inc: { usageCount: 1 } });
      }
    }
    
    const newPage = await Page.create({
      workspace: workspaceId,
      title,
      icon: icon || '📄',
      parentPage: parentPageId || null,
      content: pageContent,
      isFavorite: false,
      isPublished: true,
      author: userId,
      lastEditedBy: userId,
      tags: []
    });
    
    res.redirect(`/workspaces/${workspaceId}/pages/${newPage._id}`);
  } catch (error) {
    console.error('Create page error:', error);
    res.status(500).render('error', {
      title: 'Error',
      errorMessage: 'Failed to create page',
      errorCode: 500,
      user: req.session.user
    });
  }
};

// Show edit page form
exports.showEditForm = async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    const pageId = req.params.id;
    
    const workspace = await Workspace.findById(workspaceId).lean();
    const page = await Page.findById(pageId).lean();
    
    if (!workspace || !page || page.workspace.toString() !== workspaceId) {
      return res.status(404).render('404', {
        title: 'Page Not Found',
        user: req.session.user
      });
    }
    
    workspace.id = workspace._id.toString();
    page.id = page._id.toString();
    
    // Get page tree for sidebar and favorites
    const pageTree = await buildPageTree(workspaceId);
    const favoritePages = await Page.find({ workspace: workspaceId, isFavorite: true }).lean();
    const favoritePagesWithId = favoritePages.map(p => ({ ...p, id: p._id.toString() }));
    
    res.render('pages/edit', {
      title: `Edit ${page.title} - NoteMaster`,
      workspace,
      page,
      pageTree,
      favoritePages: favoritePagesWithId,
      user: req.session.user
    });
  } catch (error) {
    console.error('Show edit form error:', error);
    res.status(500).render('error', {
      title: 'Error',
      errorMessage: 'Failed to load edit form',
      errorCode: 500,
      user: req.session.user
    });
  }
};

// Update page
exports.updatePage = async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    const pageId = req.params.id;
    const { title, icon, content, tags } = req.body;
    const userId = req.session.userId;
    
    // Parse tags (comma-separated)
    const pageTags = tags ? tags.split(',').map(t => t.trim()).filter(t => t) : [];
    
    const updatedPage = await Page.findByIdAndUpdate(
      pageId,
      {
        title,
        icon: icon || '📄',
        content: content || '',
        tags: pageTags,
        lastEditedBy: userId
      },
      { new: true }
    );
    
    if (!updatedPage) {
      return res.status(404).render('404', {
        title: 'Page Not Found',
        user: req.session.user
      });
    }
    
    res.redirect(`/workspaces/${workspaceId}/pages/${pageId}`);
  } catch (error) {
    console.error('Update page error:', error);
    res.status(500).render('error', {
      title: 'Error',
      errorMessage: 'Failed to update page',
      errorCode: 500,
      user: req.session.user
    });
  }
};

// Toggle favorite
exports.toggleFavorite = async (req, res) => {
  try {
    const pageId = req.params.id;
    
    const page = await Page.findById(pageId);
    
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }
    
    page.isFavorite = !page.isFavorite;
    await page.save();
    
    res.json({ success: true, isFavorite: page.isFavorite });
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ success: false, message: 'Failed to toggle favorite' });
  }
};

// Delete page
exports.deletePage = async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    const pageId = req.params.id;
    
    const page = await Page.findById(pageId);
    
    if (!page) {
      return res.status(404).render('404', {
        title: 'Page Not Found',
        user: req.session.user
      });
    }
    
    // Recursively delete child pages
    async function deletePageAndChildren(id) {
      const children = await Page.find({ parentPage: id });
      for (const child of children) {
        await deletePageAndChildren(child._id);
      }
      await Page.findByIdAndDelete(id);
    }
    
    await deletePageAndChildren(pageId);
    
    res.redirect(`/workspaces/${workspaceId}`);
  } catch (error) {
    console.error('Delete page error:', error);
    res.status(500).render('error', {
      title: 'Error',
      errorMessage: 'Failed to delete page',
      errorCode: 500,
      user: req.session.user
    });
  }
};

// Search pages
exports.searchPages = async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    const query = req.query.q || '';
    
    const workspace = await Workspace.findById(workspaceId).lean();
    
    if (!workspace) {
      return res.status(404).render('404', {
        title: 'Workspace Not Found',
        user: req.session.user
      });
    }
    
    workspace.id = workspace._id.toString();
    
    // Search pages by title and content
    const results = query ? await Page.find({
      workspace: workspaceId,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } }
      ]
    }).lean() : [];
    
    const resultsWithId = results.map(r => ({ ...r, id: r._id.toString() }));
    
    // Get page tree for sidebar and favorites
    const pageTree = await buildPageTree(workspaceId);
    const favoritePages = await Page.find({ workspace: workspaceId, isFavorite: true }).lean();
    const favoritePagesWithId = favoritePages.map(p => ({ ...p, id: p._id.toString() }));
    
    res.render('pages/search', {
      title: `Search: ${query} - NoteMaster`,
      workspace,
      query,
      results: resultsWithId,
      pageTree,
      favoritePages: favoritePagesWithId,
      user: req.session.user
    });
  } catch (error) {
    console.error('Search pages error:', error);
    res.status(500).render('error', {
      title: 'Error',
      errorMessage: 'Failed to search pages',
      errorCode: 500,
      user: req.session.user
    });
  }
};

// Helper function to build breadcrumbs
async function buildBreadcrumbs(page) {
  const breadcrumbs = [];
  let currentPage = page;
  
  while (currentPage) {
    breadcrumbs.unshift({
      id: currentPage._id.toString(),
      title: currentPage.title,
      icon: currentPage.icon
    });
    
    currentPage = currentPage.parentPage ? await Page.findById(currentPage.parentPage).lean() : null;
  }
  
  return breadcrumbs;
}

// Helper function to build page tree
async function buildPageTree(workspaceId) {
  try {
    const allPages = await Page.find({ workspace: workspaceId }).sort({ title: 1 }).lean();
    const rootPages = allPages.filter(p => !p.parentPage);
    
    function getChildren(parentId) {
      return allPages
        .filter(p => p.parentPage && p.parentPage.toString() === parentId)
        .map(page => ({
          ...page,
          id: page._id.toString(),
          children: getChildren(page._id.toString())
        }));
    }
    
    return rootPages.map(page => ({
      ...page,
      id: page._id.toString(),
      children: getChildren(page._id.toString())
    }));
  } catch (error) {
    console.error('Build page tree error:', error);
    return [];
  }
}

module.exports = exports;
