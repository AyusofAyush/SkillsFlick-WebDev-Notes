// Quick test to check workspace access
require('dotenv').config();
const mongoose = require('mongoose');
const Workspace = require('./models/Workspace');
const User = require('./models/User');

async function testWorkspace() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Get demo user
    const user = await User.findOne({ username: 'demo' });
    console.log('👤 User:', user ? user.username : 'NOT FOUND');
    
    if (user) {
      // Get user's workspaces
      const workspaces = await Workspace.find({
        $or: [
          { owner: user._id },
          { 'members.user': user._id }
        ]
      });
      
      console.log(`\n📁 Found ${workspaces.length} workspaces for demo user:`);
      workspaces.forEach(w => {
        console.log(`  - ${w.name} (ID: ${w._id})`);
        console.log(`    URL: http://localhost:4000/workspaces/${w._id}`);
        console.log(`    New Page URL: http://localhost:4000/workspaces/${w._id}/pages/new`);
      });
      
      // Test the specific workspace ID from the screenshot
      const testId = '5921aa27963a40d47983b93d';
      const testWorkspace = await Workspace.findById(testId);
      console.log(`\n🔍 Testing workspace ID: ${testId}`);
      console.log(`   Result: ${testWorkspace ? 'FOUND' : 'NOT FOUND'}`);
      
      if (!testWorkspace) {
        console.log('\n⚠️  This workspace ID does not exist in the database!');
        console.log('   This is why you\'re getting 404 errors.');
        console.log('   Use one of the workspace IDs listed above instead.');
      }
    }
    
    await mongoose.connection.close();
    console.log('\n🔌 Connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testWorkspace();
