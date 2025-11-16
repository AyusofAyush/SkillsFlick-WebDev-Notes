/**
 * 01 - Test MongoDB Atlas Connection
 * 
 * This script tests your MongoDB Atlas connection
 * Run: npm run test-connection
 */

require('dotenv').config();
const { MongoClient } = require('mongodb');

// Get connection string from environment variables
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ ERROR: MONGODB_URI not found in .env file');
  console.log('\n📝 Steps to fix:');
  console.log('1. Copy .env.example to .env');
  console.log('2. Replace the connection string with your MongoDB Atlas URI');
  console.log('3. Make sure to replace <password> with your actual password\n');
  process.exit(1);
}

const client = new MongoClient(uri);

async function testConnection() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...\n');
    
    // Connect to MongoDB
    await client.connect();
    console.log('✅ Successfully connected to MongoDB Atlas!\n');
    
    // Test database operations
    const dbName = process.env.DB_NAME || 'session19_practice';
    const db = client.db(dbName);
    
    console.log(`📊 Using database: ${dbName}\n`);
    
    // List all databases
    const adminDb = client.db().admin();
    const databases = await adminDb.listDatabases();
    
    console.log('📚 Available Databases:');
    databases.databases.forEach((database) => {
      console.log(`  - ${database.name} (${(database.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    });
    
    // List collections in current database
    const collections = await db.listCollections().toArray();
    console.log(`\n📁 Collections in "${dbName}":`);
    
    if (collections.length === 0) {
      console.log('  (No collections yet - they will be created when you insert data)');
    } else {
      collections.forEach((collection) => {
        console.log(`  - ${collection.name}`);
      });
    }
    
    // Test a simple operation
    console.log('\n🧪 Testing write operation...');
    const testCollection = db.collection('connection_test');
    const result = await testCollection.insertOne({
      message: 'Connection test successful!',
      timestamp: new Date(),
      testId: Math.random().toString(36).substring(7)
    });
    
    console.log('✅ Write test successful!');
    console.log(`  Document inserted with ID: ${result.insertedId}`);
    
    // // Clean up test document
    // await testCollection.deleteOne({ _id: result.insertedId });
    // console.log('🧹 Cleaned up test document');
    
    console.log('\n✨ All tests passed! Your MongoDB Atlas connection is working perfectly.\n');
    
  } catch (error) {
    console.error('\n❌ Connection test failed!\n');
    console.error('Error details:', error.message);
    
    // Provide helpful error messages
    if (error.message.includes('bad auth')) {
      console.log('\n💡 Authentication error - Check:');
      console.log('  1. Username is correct');
      console.log('  2. Password is correct (no typos)');
      console.log('  3. Special characters in password are URL encoded');
      console.log('     # → %23, @ → %40, etc.');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('timeout')) {
      console.log('\n💡 Network error - Check:');
      console.log('  1. Your IP is whitelisted in MongoDB Atlas Network Access');
      console.log('  2. Try allowing access from anywhere (0.0.0.0/0)');
      console.log('  3. Check your internet connection');
    }
    
    console.log('\n📖 For more help, check MONGODB_ATLAS_SETUP.md\n');
    
  } finally {
    await client.close();
    console.log('🔌 Connection closed\n');
  }
}

// Run the test
testConnection().catch(console.error);
