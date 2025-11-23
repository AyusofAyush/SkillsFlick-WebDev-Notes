// Mock Database for NoteMaster - A Notion Clone
// In production, this would be replaced with MongoDB, PostgreSQL, etc.

const bcrypt = require('bcrypt');

// Users Database
const users = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@notemaster.com',
    fullName: 'Admin User',
    // Password: 'admin123'
    password: '$2b$10$YvZ9LqVZ.qZVZ9LqVZ.qZO8x7y6z5a4b3c2d1e0f9g8h7i6j5k4l3',
    avatar: '👨‍💼',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date('2024-11-17')
  },
  {
    id: 2,
    username: 'john_doe',
    email: 'john@example.com',
    fullName: 'John Doe',
    // Password: 'password123'
    password: '$2b$10$rQZ5qZQZ5qZQZ5qZQZ5qZO8x7y6z5a4b3c2d1e0f9g8h7i6j5k4l3',
    avatar: '👨‍💻',
    role: 'user',
    createdAt: new Date('2024-02-15'),
    lastLogin: new Date('2024-11-16')
  },
  {
    id: 3,
    username: 'jane_smith',
    email: 'jane@example.com',
    fullName: 'Jane Smith',
    // Password: 'password123'
    password: '$2b$10$rQZ5qZQZ5qZQZ5qZQZ5qZO8x7y6z5a4b3c2d1e0f9g8h7i6j5k4l3',
    avatar: '👩‍🎨',
    role: 'user',
    createdAt: new Date('2024-03-10'),
    lastLogin: new Date('2024-11-15')
  }
];

// Workspaces Database
const workspaces = [
  {
    id: 1,
    name: 'Personal Workspace',
    icon: '🏠',
    ownerId: 2,
    members: [1, 2], // Added admin for testing
    isPublic: false,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-11-17')
  },
  {
    id: 2,
    name: 'Work Projects',
    icon: '💼',
    ownerId: 2,
    members: [1, 2, 3], // Added admin for testing
    isPublic: false,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-11-16')
  },
  {
    id: 3,
    name: 'Learning Hub',
    icon: '📚',
    ownerId: 3,
    members: [1, 2, 3], // Added admin for testing
    isPublic: true,
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-11-15')
  },
  {
    id: 4,
    name: 'Admin Dashboard',
    icon: '⚙️',
    ownerId: 1,
    members: [1],
    isPublic: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-11-17')
  }
];

// Pages Database (can be nested)
const pages = [
  // Personal Workspace Pages
  {
    id: 1,
    workspaceId: 1,
    title: 'Welcome to NoteMaster',
    icon: '👋',
    parentPageId: null,
    content: 'Welcome to your personal workspace! This is where you can organize all your notes, ideas, and projects.',
    isFavorite: true,
    isArchived: false,
    createdBy: 2,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-11-17'),
    tags: ['welcome', 'getting-started']
  },
  {
    id: 2,
    workspaceId: 1,
    title: 'Daily Journal',
    icon: '📔',
    parentPageId: null,
    content: 'My daily thoughts and reflections.',
    isFavorite: true,
    isArchived: false,
    createdBy: 2,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-11-16'),
    tags: ['journal', 'personal']
  },
  {
    id: 3,
    workspaceId: 1,
    title: 'November 17, 2024',
    icon: '📅',
    parentPageId: 2,
    content: 'Today was productive! Learned about Express.js templating engines and built this Notion clone.',
    isFavorite: false,
    isArchived: false,
    createdBy: 2,
    createdAt: new Date('2024-11-17'),
    updatedAt: new Date('2024-11-17'),
    tags: ['journal', 'daily']
  },
  {
    id: 4,
    workspaceId: 1,
    title: 'Book Notes',
    icon: '📖',
    parentPageId: null,
    content: 'Notes from books I\'m reading.',
    isFavorite: false,
    isArchived: false,
    createdBy: 2,
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-11-10'),
    tags: ['books', 'learning']
  },
  
  // Work Projects Pages
  {
    id: 5,
    workspaceId: 2,
    title: 'Q4 2024 Planning',
    icon: '📊',
    parentPageId: null,
    content: 'Strategic planning for Q4 2024 initiatives and goals.',
    isFavorite: true,
    isArchived: false,
    createdBy: 2,
    createdAt: new Date('2024-09-01'),
    updatedAt: new Date('2024-11-15'),
    tags: ['planning', 'strategy']
  },
  {
    id: 6,
    workspaceId: 2,
    title: 'Project Alpha - Web App Redesign',
    icon: '🎨',
    parentPageId: null,
    content: 'Complete redesign of the company web application with modern UI/UX.',
    isFavorite: true,
    isArchived: false,
    createdBy: 2,
    createdAt: new Date('2024-10-01'),
    updatedAt: new Date('2024-11-17'),
    tags: ['project', 'design', 'high-priority']
  },
  {
    id: 7,
    workspaceId: 2,
    title: 'Design System',
    icon: '🎨',
    parentPageId: 6,
    content: 'Component library and design tokens for consistent UI across the application.',
    isFavorite: false,
    isArchived: false,
    createdBy: 2,
    createdAt: new Date('2024-10-05'),
    updatedAt: new Date('2024-11-12'),
    tags: ['design', 'components']
  },
  {
    id: 8,
    workspaceId: 2,
    title: 'API Documentation',
    icon: '📡',
    parentPageId: 6,
    content: 'Complete API reference for the backend services.',
    isFavorite: false,
    isArchived: false,
    createdBy: 3,
    createdAt: new Date('2024-10-10'),
    updatedAt: new Date('2024-11-14'),
    tags: ['api', 'documentation']
  },
  {
    id: 9,
    workspaceId: 2,
    title: 'Meeting Notes',
    icon: '📝',
    parentPageId: null,
    content: 'Notes from team meetings and discussions.',
    isFavorite: false,
    isArchived: false,
    createdBy: 2,
    createdAt: new Date('2024-09-15'),
    updatedAt: new Date('2024-11-16'),
    tags: ['meetings', 'notes']
  },
  
  // Learning Hub Pages
  {
    id: 10,
    workspaceId: 3,
    title: 'JavaScript Mastery',
    icon: '⚡',
    parentPageId: null,
    content: 'Comprehensive guide to mastering JavaScript.',
    isFavorite: true,
    isArchived: false,
    createdBy: 3,
    createdAt: new Date('2024-05-01'),
    updatedAt: new Date('2024-11-15'),
    tags: ['javascript', 'programming', 'tutorial']
  },
  {
    id: 11,
    workspaceId: 3,
    title: 'Node.js & Express',
    icon: '🟢',
    parentPageId: 10,
    content: 'Backend development with Node.js and Express framework.',
    isFavorite: false,
    isArchived: false,
    createdBy: 3,
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-11-14'),
    tags: ['nodejs', 'express', 'backend']
  },
  {
    id: 12,
    workspaceId: 3,
    title: 'Templating Engines - EJS',
    icon: '📄',
    parentPageId: 11,
    content: 'Learn how to use EJS for server-side rendering in Express applications.',
    isFavorite: true,
    isArchived: false,
    createdBy: 3,
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-17'),
    tags: ['ejs', 'templating', 'ssr']
  },
  {
    id: 13,
    workspaceId: 3,
    title: 'React Fundamentals',
    icon: '⚛️',
    parentPageId: 10,
    content: 'Building modern user interfaces with React.',
    isFavorite: false,
    isArchived: false,
    createdBy: 3,
    createdAt: new Date('2024-07-01'),
    updatedAt: new Date('2024-11-10'),
    tags: ['react', 'frontend', 'javascript']
  }
];

// Blocks Database (different content types within pages)
const blocks = [
  // Blocks for "Welcome to NoteMaster" page
  {
    id: 1,
    pageId: 1,
    type: 'heading1',
    content: 'Welcome to NoteMaster! 🎉',
    order: 1,
    createdAt: new Date('2024-02-15')
  },
  {
    id: 2,
    pageId: 1,
    type: 'paragraph',
    content: 'NoteMaster is your all-in-one workspace for notes, docs, and collaboration.',
    order: 2,
    createdAt: new Date('2024-02-15')
  },
  {
    id: 3,
    pageId: 1,
    type: 'heading2',
    content: 'Getting Started',
    order: 3,
    createdAt: new Date('2024-02-15')
  },
  {
    id: 4,
    pageId: 1,
    type: 'list',
    content: 'Create your first page|Add content blocks|Organize with workspaces|Share with your team',
    order: 4,
    createdAt: new Date('2024-02-15')
  },
  {
    id: 5,
    pageId: 1,
    type: 'callout',
    content: '💡 Tip: Use the sidebar to navigate between pages and workspaces!',
    order: 5,
    createdAt: new Date('2024-02-15')
  },
  
  // Blocks for "Project Alpha" page
  {
    id: 6,
    pageId: 6,
    type: 'heading1',
    content: 'Project Alpha - Web App Redesign',
    order: 1,
    createdAt: new Date('2024-10-01')
  },
  {
    id: 7,
    pageId: 6,
    type: 'paragraph',
    content: 'Complete redesign of our web application with focus on modern UI/UX and performance.',
    order: 2,
    createdAt: new Date('2024-10-01')
  },
  {
    id: 8,
    pageId: 6,
    type: 'heading2',
    content: 'Project Goals',
    order: 3,
    createdAt: new Date('2024-10-01')
  },
  {
    id: 9,
    pageId: 6,
    type: 'list',
    content: 'Improve page load speed by 50%|Implement responsive design|Create consistent design system|Enhance accessibility (WCAG 2.1 AA)',
    order: 4,
    createdAt: new Date('2024-10-01')
  },
  {
    id: 10,
    pageId: 6,
    type: 'code',
    content: '// New routing structure\nconst express = require(\'express\');\nconst app = express();\n\napp.get(\'/workspace/:id\', (req, res) => {\n  res.render(\'workspace\', { id: req.params.id });\n});',
    order: 5,
    createdAt: new Date('2024-10-05')
  },
  
  // Blocks for "Templating Engines - EJS" page
  {
    id: 11,
    pageId: 12,
    type: 'heading1',
    content: 'Templating Engines - EJS Tutorial',
    order: 1,
    createdAt: new Date('2024-11-01')
  },
  {
    id: 12,
    pageId: 12,
    type: 'paragraph',
    content: 'EJS (Embedded JavaScript) is a simple templating language that lets you generate HTML markup with plain JavaScript.',
    order: 2,
    createdAt: new Date('2024-11-01')
  },
  {
    id: 13,
    pageId: 12,
    type: 'heading2',
    content: 'Key Features',
    order: 3,
    createdAt: new Date('2024-11-01')
  },
  {
    id: 14,
    pageId: 12,
    type: 'list',
    content: 'Fast compilation and rendering|Simple syntax (<% %>)|Template inheritance|Partials for reusable components',
    order: 4,
    createdAt: new Date('2024-11-01')
  },
  {
    id: 15,
    pageId: 12,
    type: 'code',
    content: '<!-- Basic EJS Syntax -->\n<h1><%= pageTitle %></h1>\n\n<% if (user.isLoggedIn) { %>\n  <p>Welcome, <%= user.name %>!</p>\n<% } %>',
    order: 5,
    createdAt: new Date('2024-11-01')
  }
];

// Templates Database
const templates = [
  {
    id: 1,
    name: 'Meeting Notes',
    icon: '📝',
    description: 'Template for taking meeting notes',
    category: 'productivity',
    content: '# Meeting Notes\n\n**Date:** \n**Attendees:** \n**Agenda:** \n\n## Discussion Points\n\n## Action Items\n\n## Next Steps',
    usageCount: 15,
    createdBy: 1,
    createdAt: new Date('2024-01-15')
  },
  {
    id: 2,
    name: 'Project Proposal',
    icon: '📊',
    description: 'Template for creating project proposals',
    category: 'projects',
    content: '# Project Proposal\n\n## Executive Summary\n\n## Problem Statement\n\n## Proposed Solution\n\n## Timeline\n\n## Budget\n\n## Success Metrics',
    usageCount: 8,
    createdBy: 1,
    createdAt: new Date('2024-01-20')
  },
  {
    id: 3,
    name: 'Daily Journal',
    icon: '📔',
    description: 'Template for daily journaling',
    category: 'personal',
    content: '# Daily Journal - [Date]\n\n## Gratitude\nWhat am I grateful for today?\n\n## Goals\nWhat do I want to accomplish?\n\n## Reflections\nWhat did I learn today?',
    usageCount: 42,
    createdBy: 2,
    createdAt: new Date('2024-02-01')
  },
  {
    id: 4,
    name: 'Code Documentation',
    icon: '💻',
    description: 'Template for documenting code',
    category: 'development',
    content: '# [Function/Module Name]\n\n## Description\n\n## Parameters\n\n## Return Value\n\n## Examples\n\n```javascript\n// Code example\n```\n\n## Notes',
    usageCount: 23,
    createdBy: 3,
    createdAt: new Date('2024-02-10')
  }
];

// Tags Database
const tags = [
  { id: 1, name: 'welcome', color: '#3b82f6', usageCount: 1 },
  { id: 2, name: 'getting-started', color: '#10b981', usageCount: 1 },
  { id: 3, name: 'journal', color: '#f59e0b', usageCount: 2 },
  { id: 4, name: 'personal', color: '#ef4444', usageCount: 2 },
  { id: 5, name: 'daily', color: '#8b5cf6', usageCount: 1 },
  { id: 6, name: 'books', color: '#ec4899', usageCount: 1 },
  { id: 7, name: 'learning', color: '#14b8a6', usageCount: 2 },
  { id: 8, name: 'planning', color: '#f97316', usageCount: 1 },
  { id: 9, name: 'strategy', color: '#6366f1', usageCount: 1 },
  { id: 10, name: 'project', color: '#0ea5e9', usageCount: 1 },
  { id: 11, name: 'design', color: '#d946ef', usageCount: 2 },
  { id: 12, name: 'high-priority', color: '#ef4444', usageCount: 1 },
  { id: 13, name: 'components', color: '#a855f7', usageCount: 1 },
  { id: 14, name: 'api', color: '#22c55e', usageCount: 1 },
  { id: 15, name: 'documentation', color: '#06b6d4', usageCount: 1 },
  { id: 16, name: 'meetings', color: '#84cc16', usageCount: 1 },
  { id: 17, name: 'notes', color: '#eab308', usageCount: 1 },
  { id: 18, name: 'javascript', color: '#f59e0b', usageCount: 2 },
  { id: 19, name: 'programming', color: '#3b82f6', usageCount: 1 },
  { id: 20, name: 'tutorial', color: '#8b5cf6', usageCount: 1 },
  { id: 21, name: 'nodejs', color: '#10b981', usageCount: 1 },
  { id: 22, name: 'express', color: '#6366f1', usageCount: 1 },
  { id: 23, name: 'backend', color: '#0ea5e9', usageCount: 1 },
  { id: 24, name: 'ejs', color: '#f97316', usageCount: 1 },
  { id: 25, name: 'templating', color: '#ec4899', usageCount: 1 },
  { id: 26, name: 'ssr', color: '#14b8a6', usageCount: 1 },
  { id: 27, name: 'react', color: '#06b6d4', usageCount: 1 },
  { id: 28, name: 'frontend', color: '#a855f7', usageCount: 1 }
];

// Activity Log
const activities = [
  {
    id: 1,
    userId: 2,
    action: 'created',
    targetType: 'page',
    targetId: 3,
    targetName: 'November 17, 2024',
    workspaceId: 1,
    timestamp: new Date('2024-11-17T10:30:00')
  },
  {
    id: 2,
    userId: 3,
    action: 'updated',
    targetType: 'page',
    targetId: 12,
    targetName: 'Templating Engines - EJS',
    workspaceId: 3,
    timestamp: new Date('2024-11-17T09:15:00')
  },
  {
    id: 3,
    userId: 2,
    action: 'created',
    targetType: 'workspace',
    targetId: 2,
    targetName: 'Work Projects',
    workspaceId: 2,
    timestamp: new Date('2024-03-01T14:00:00')
  }
];

// Helper functions for database operations
const db = {
  // User operations
  users: {
    getAll: () => users,
    getById: (id) => users.find(u => u.id === parseInt(id)),
    getByUsername: (username) => users.find(u => u.username === username),
    getByEmail: (email) => users.find(u => u.email === email),
    create: (userData) => {
      const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        ...userData,
        createdAt: new Date(),
        lastLogin: new Date()
      };
      users.push(newUser);
      return newUser;
    },
    update: (id, userData) => {
      const index = users.findIndex(u => u.id === parseInt(id));
      if (index !== -1) {
        users[index] = { ...users[index], ...userData };
        return users[index];
      }
      return null;
    }
  },

  // Workspace operations
  workspaces: {
    getAll: () => workspaces,
    getById: (id) => workspaces.find(w => w.id === parseInt(id)),
    getByUserId: (userId) => workspaces.filter(w => w.members.includes(parseInt(userId))),
    getByOwnerId: (ownerId) => workspaces.filter(w => w.ownerId === parseInt(ownerId)),
    create: (workspaceData) => {
      const newWorkspace = {
        id: workspaces.length > 0 ? Math.max(...workspaces.map(w => w.id)) + 1 : 1,
        ...workspaceData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      workspaces.push(newWorkspace);
      return newWorkspace;
    },
    update: (id, workspaceData) => {
      const index = workspaces.findIndex(w => w.id === parseInt(id));
      if (index !== -1) {
        workspaces[index] = {
          ...workspaces[index],
          ...workspaceData,
          updatedAt: new Date()
        };
        return workspaces[index];
      }
      return null;
    },
    delete: (id) => {
      const index = workspaces.findIndex(w => w.id === parseInt(id));
      if (index !== -1) {
        return workspaces.splice(index, 1)[0];
      }
      return null;
    }
  },

  // Page operations
  pages: {
    getAll: () => pages,
    getById: (id) => pages.find(p => p.id === parseInt(id)),
    getByWorkspaceId: (workspaceId) => pages.filter(p => p.workspaceId === parseInt(workspaceId)),
    getByParentId: (parentId) => pages.filter(p => p.parentPageId === parseInt(parentId)),
    getRootPages: (workspaceId) => pages.filter(p => 
      p.workspaceId === parseInt(workspaceId) && p.parentPageId === null
    ),
    getFavorites: (workspaceId) => pages.filter(p => 
      p.workspaceId === parseInt(workspaceId) && p.isFavorite
    ),
    create: (pageData) => {
      const newPage = {
        id: pages.length > 0 ? Math.max(...pages.map(p => p.id)) + 1 : 1,
        ...pageData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      pages.push(newPage);
      return newPage;
    },
    update: (id, pageData) => {
      const index = pages.findIndex(p => p.id === parseInt(id));
      if (index !== -1) {
        pages[index] = {
          ...pages[index],
          ...pageData,
          updatedAt: new Date()
        };
        return pages[index];
      }
      return null;
    },
    delete: (id) => {
      const index = pages.findIndex(p => p.id === parseInt(id));
      if (index !== -1) {
        return pages.splice(index, 1)[0];
      }
      return null;
    },
    search: (workspaceId, query) => {
      const searchLower = query.toLowerCase();
      return pages.filter(p => 
        p.workspaceId === parseInt(workspaceId) && (
          p.title.toLowerCase().includes(searchLower) ||
          p.content.toLowerCase().includes(searchLower)
        )
      );
    }
  },

  // Block operations
  blocks: {
    getAll: () => blocks,
    getByPageId: (pageId) => blocks.filter(b => b.pageId === parseInt(pageId)).sort((a, b) => a.order - b.order),
    create: (blockData) => {
      const newBlock = {
        id: blocks.length > 0 ? Math.max(...blocks.map(b => b.id)) + 1 : 1,
        ...blockData,
        createdAt: new Date()
      };
      blocks.push(newBlock);
      return newBlock;
    },
    update: (id, blockData) => {
      const index = blocks.findIndex(b => b.id === parseInt(id));
      if (index !== -1) {
        blocks[index] = { ...blocks[index], ...blockData };
        return blocks[index];
      }
      return null;
    },
    delete: (id) => {
      const index = blocks.findIndex(b => b.id === parseInt(id));
      if (index !== -1) {
        return blocks.splice(index, 1)[0];
      }
      return null;
    }
  },

  // Template operations
  templates: {
    getAll: () => templates,
    getById: (id) => templates.find(t => t.id === parseInt(id)),
    getByCategory: (category) => templates.filter(t => t.category === category),
    create: (templateData) => {
      const newTemplate = {
        id: templates.length > 0 ? Math.max(...templates.map(t => t.id)) + 1 : 1,
        ...templateData,
        usageCount: 0,
        createdAt: new Date()
      };
      templates.push(newTemplate);
      return newTemplate;
    },
    incrementUsage: (id) => {
      const template = templates.find(t => t.id === parseInt(id));
      if (template) {
        template.usageCount++;
        return template;
      }
      return null;
    }
  },

  // Tag operations
  tags: {
    getAll: () => tags,
    getByName: (name) => tags.find(t => t.name === name),
    create: (tagData) => {
      const newTag = {
        id: tags.length > 0 ? Math.max(...tags.map(t => t.id)) + 1 : 1,
        ...tagData,
        usageCount: 0
      };
      tags.push(newTag);
      return newTag;
    }
  },

  // Activity operations
  activities: {
    getAll: () => activities,
    getByWorkspaceId: (workspaceId, limit = 10) => 
      activities
        .filter(a => a.workspaceId === parseInt(workspaceId))
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, limit),
    create: (activityData) => {
      const newActivity = {
        id: activities.length > 0 ? Math.max(...activities.map(a => a.id)) + 1 : 1,
        ...activityData,
        timestamp: new Date()
      };
      activities.push(newActivity);
      return newActivity;
    }
  }
};

module.exports = db;
