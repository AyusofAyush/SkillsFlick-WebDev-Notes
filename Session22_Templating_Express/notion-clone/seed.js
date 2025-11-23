// Seed script to populate database with initial data
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Workspace = require('./models/Workspace');
const Page = require('./models/Page');
const Template = require('./models/Template');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Workspace.deleteMany({});
    await Page.deleteMany({});
    await Template.deleteMany({});
    
    console.log('🗑️  Cleared existing data');
    
    // Create demo users
    const demoUser = await User.create({
      username: 'demo',
      email: 'demo@notemaster.com',
      fullName: 'Demo User',
      password: 'demo123',
      avatar: '👤',
      role: 'user'
    });
    
    console.log('👤 Created demo user');
    
    // Create templates
    const templates = await Template.create([
      {
        name: 'Meeting Notes',
        description: 'Template for organizing meeting notes with agenda and action items',
        category: 'work',
        icon: '📅',
        content: '# Meeting Notes\n\n## Attendees\n- \n\n## Agenda\n1. \n\n## Discussion\n\n## Action Items\n- [ ] \n\n## Next Steps\n',
        isPublic: true,
        usageCount: 0
      },
      {
        name: 'Project Plan',
        description: 'Comprehensive project planning template',
        category: 'project',
        icon: '📊',
        content: '# Project Plan\n\n## Overview\n\n## Goals\n\n## Timeline\n\n## Resources\n\n## Milestones\n',
        isPublic: true,
        usageCount: 0
      },
      {
        name: 'Daily Journal',
        description: 'Personal daily journal template',
        category: 'personal',
        icon: '📔',
        content: '# Daily Journal\n\n## Date: \n\n## Mood: \n\n## Highlights\n\n## Reflections\n\n## Tomorrow\'s Goals\n',
        isPublic: true,
        usageCount: 0
      },
      {
        name: 'Study Notes',
        description: 'Template for taking organized study notes',
        category: 'education',
        icon: '📚',
        content: '# Study Notes\n\n## Subject: \n\n## Topic: \n\n## Key Concepts\n\n## Examples\n\n## Questions\n',
        isPublic: true,
        usageCount: 0
      }
    ]);
    
    console.log('📋 Created templates');
    
    // Create a workspace for demo user
    const demoWorkspace = await Workspace.create({
      name: 'My Workspace',
      description: 'Demo workspace for testing',
      icon: '🏠',
      owner: demoUser._id,
      members: [
        {
          user: demoUser._id,
          role: 'owner',
          addedAt: new Date()
        }
      ],
      isPublic: false
    });
    
    console.log('📁 Created workspace');
    
    // Create sample pages in the workspace
    const welcomePage = await Page.create({
      workspace: demoWorkspace._id,
      title: 'Welcome to NoteMaster',
      icon: '👋',
      parentPage: null,
      content: '# Welcome to NoteMaster!\n\nThis is your personal workspace for organizing notes, ideas, and knowledge.\n\n## Getting Started\n\n1. Create new pages using the sidebar\n2. Organize pages in hierarchies\n3. Use templates for quick page creation\n4. Search across all your content\n\nHappy note-taking! 📝',
      author: demoUser._id,
      lastEditedBy: demoUser._id,
      isFavorite: true,
      isPublished: true
    });
    
    const projectPage = await Page.create({
      workspace: demoWorkspace._id,
      title: 'Projects',
      icon: '📂',
      parentPage: null,
      content: '# My Projects\n\nKeep track of all your projects here.',
      author: demoUser._id,
      lastEditedBy: demoUser._id,
      isFavorite: false,
      isPublished: true
    });
    
    const subPage = await Page.create({
      workspace: demoWorkspace._id,
      title: 'NoteMaster App',
      icon: '💻',
      parentPage: projectPage._id,
      content: '# NoteMaster App Project\n\n## Overview\n\nA full-stack note-taking application built with Node.js, Express, and MongoDB.\n\n## Features\n\n- User authentication\n- Workspace management\n- Hierarchical pages\n- Rich text editing\n- Search functionality\n\n## Tech Stack\n\n- Backend: Node.js + Express\n- Database: MongoDB + Mongoose\n- Frontend: EJS templates\n- Styling: Custom CSS',
      author: demoUser._id,
      lastEditedBy: demoUser._id,
      isFavorite: true,
      tags: ['development', 'nodejs', 'mongodb'],
      isPublished: true
    });
    
    console.log('📄 Created sample pages');
    
    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Demo Login Credentials:');
    console.log('   Username: demo');
    console.log('   Password: demo123');
    console.log('\n📊 Created Data:');
    console.log(`   - 1 User (${demoUser.username})`);
    console.log(`   - 1 Workspace (${demoWorkspace.name})`);
    console.log(`   - 3 Pages (Welcome, Projects, NoteMaster App)`);
    console.log(`   - ${templates.length} Templates`);
    console.log('');
    
  } catch (error) {
    console.error('❌ Seed error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run seeder
connectDB().then(() => {
  seedData();
});
