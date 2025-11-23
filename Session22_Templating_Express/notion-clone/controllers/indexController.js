// Home & Template Controller
const Workspace = require('../models/Workspace');
const Template = require('../models/Template');

// Show landing page (if not logged in) or redirect to workspaces
exports.showHome = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.render('index', {
        title: 'NoteMaster - Your All-in-One Workspace',
        user: null
      });
    }
    
    // Get user's workspaces
    const workspaces = await Workspace.find({
      $or: [
        { owner: req.session.userId },
        { 'members.user': req.session.userId }
      ]
    }).limit(1);
    
    // If user has workspaces, redirect to first workspace
    if (workspaces.length > 0) {
      return res.redirect(`/workspaces/${workspaces[0]._id}`);
    }
    
    // Otherwise, show workspace list
    res.redirect('/workspaces');
  } catch (error) {
    console.error('Show home error:', error);
    res.render('index', {
      title: 'NoteMaster - Your All-in-One Workspace',
      user: req.session.user
    });
  }
};

// Show all templates
exports.getAllTemplates = async (req, res) => {
  try {
    const category = req.query.category || null;
    
    const query = category ? { category, isPublic: true } : { isPublic: true };
    const templates = await Template.find(query).sort({ usageCount: -1 }).lean();
    
    // Add id field for template compatibility
    const templatesWithId = templates.map(t => ({ ...t, id: t._id.toString() }));
    
    const categories = ['personal', 'work', 'education', 'project', 'general'];
    
    res.render('templates/index', {
      title: 'Templates',
      templates: templatesWithId,
      categories,
      selectedCategory: category,
      user: req.session.user
    });
  } catch (error) {
    console.error('Get templates error:', error);
    res.render('templates/index', {
      title: 'Templates',
      templates: [],
      categories: [],
      selectedCategory: null,
      user: req.session.user
    });
  }
};

// Show single template
exports.getTemplate = async (req, res) => {
  try {
    const templateId = req.params.id;
    const template = await Template.findById(templateId).lean();
    
    if (!template) {
      return res.status(404).render('404', {
        title: 'Template Not Found',
        user: req.session.user
      });
    }
    
    // Add id field for template compatibility
    template.id = template._id.toString();
    
    // Increment usage count
    await Template.findByIdAndUpdate(templateId, { $inc: { usageCount: 1 } });
    
    res.render('templates/show', {
      title: template.name,
      template,
      user: req.session.user
    });
  } catch (error) {
    console.error('Get template error:', error);
    res.status(404).render('404', {
      title: 'Template Not Found',
      user: req.session.user
    });
  }
};

module.exports = exports;
