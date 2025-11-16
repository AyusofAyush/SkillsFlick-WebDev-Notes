/**
 * 02 - Basic CRUD Operations
 * 
 * Demonstrates Create, Read, Update, Delete operations in MongoDB
 * Run: npm run crud-basic
 */

require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function runCRUDOperations() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas\n');
    
    const db = client.db(process.env.DB_NAME || 'session19_practice');
    const usersCollection = db.collection('users');
    
    // ========================================
    // CREATE (INSERT) OPERATIONS
    // ========================================
    console.log('📝 CREATE OPERATIONS\n');
    console.log('─'.repeat(50));
    
    // Insert One Document
    console.log('\n1️⃣ Insert One User:');
    const newUser = {
      name: 'John Doe',
      email: 'john.doe@email.com',
      age: 28,
      city: 'Chennai',
      interests: ['coding', 'reading', 'gaming'],
      createdAt: new Date()
    };
    
    const insertOneResult = await usersCollection.insertOne(newUser);
    console.log(`   ✅ Inserted user with ID: ${insertOneResult.insertedId}`);
    
    // Insert Many Documents
    console.log('\n2️⃣ Insert Multiple Users:');
    const newUsers = [
      {
        name: 'Jane Smith',
        email: 'jane.smith@email.com',
        age: 32,
        city: 'Mumbai',
        interests: ['photography', 'travel'],
        createdAt: new Date()
      },
      {
        name: 'Bob Johnson',
        email: 'bob.johnson@email.com',
        age: 25,
        city: 'Delhi',
        interests: ['sports', 'music', 'cooking'],
        createdAt: new Date()
      },
      {
        name: 'Alice Williams',
        email: 'alice.williams@email.com',
        age: 30,
        city: 'Bangalore',
        interests: ['coding', 'yoga'],
        createdAt: new Date()
      }
    ];
    
    const insertManyResult = await usersCollection.insertMany(newUsers);
    console.log(`   ✅ Inserted ${insertManyResult.insertedCount} users`);
    console.log(`   📋 IDs:`, Object.values(insertManyResult.insertedIds));
    
    // ========================================
    // READ (FIND) OPERATIONS
    // ========================================
    console.log('\n\n📖 READ OPERATIONS\n');
    console.log('─'.repeat(50));
    
    // Find All Documents
    console.log('\n1️⃣ Find All Users:');
    const allUsers = await usersCollection.find({}).toArray();
    console.log(`   📊 Total users: ${allUsers.length}`);
    allUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name} (${user.email}) - ${user.city}`);
    });
    
    // Find One Document
    console.log('\n2️⃣ Find One User (by email):');
    const oneUser = await usersCollection.findOne({ email: 'john.doe@email.com' });
    if (oneUser) {
      console.log(`   ✅ Found: ${oneUser.name}, Age: ${oneUser.age}`);
      console.log(`   🆔 ID: ${oneUser._id}`);
    }
    
    // Find with Filter
    console.log('\n3️⃣ Find Users Over 28:');
    const olderUsers = await usersCollection.find({ age: { $gt: 28 } }).toArray();
    console.log(`   📊 Found ${olderUsers.length} users:`);
    olderUsers.forEach(user => {
      console.log(`   - ${user.name}: ${user.age} years old`);
    });
    
    // Find with Multiple Conditions
    console.log('\n4️⃣ Find Users in Chennai who like coding:');
    const chennaiCoders = await usersCollection.find({
      city: 'Chennai',
      interests: 'coding'
    }).toArray();
    console.log(`   📊 Found ${chennaiCoders.length} user(s):`);
    chennaiCoders.forEach(user => {
      console.log(`   - ${user.name}: ${user.interests.join(', ')}`);
    });
    
    // Find with Sorting
    console.log('\n5️⃣ Find All Users (sorted by age):');
    const sortedUsers = await usersCollection
      .find({})
      .sort({ age: 1 })  // 1 for ascending, -1 for descending
      .toArray();
    console.log('   📊 Users (youngest to oldest):');
    sortedUsers.forEach(user => {
      console.log(`   - ${user.name}: ${user.age} years`);
    });
    
    // Find with Limit
    console.log('\n6️⃣ Find First 2 Users:');
    const limitedUsers = await usersCollection
      .find({})
      .limit(2)
      .toArray();
    limitedUsers.forEach(user => {
      console.log(`   - ${user.name}`);
    });
    
    // Find with Projection (select specific fields)
    console.log('\n7️⃣ Find Users (only name and email):');
    const projectedUsers = await usersCollection
      .find({}, { projection: { name: 1, email: 1, _id: 0 } })
      .toArray();
    projectedUsers.forEach(user => {
      console.log(`   - ${user.name} <${user.email}>`);
    });
    
    // ========================================
    // UPDATE OPERATIONS
    // ========================================
    console.log('\n\n✏️  UPDATE OPERATIONS\n');
    console.log('─'.repeat(50));
    
    // Update One Document
    console.log('\n1️⃣ Update One User (change age):');
    const updateOneResult = await usersCollection.updateOne(
      { email: 'john.doe@email.com' },  // Filter
      { $set: { age: 29, updatedAt: new Date() } }  // Update
    );
    console.log(`   ✅ Matched: ${updateOneResult.matchedCount} document(s)`);
    console.log(`   ✅ Modified: ${updateOneResult.modifiedCount} document(s)`);
    
    // Verify update
    const updatedUser = await usersCollection.findOne({ email: 'john.doe@email.com' });
    console.log(`   📊 New age: ${updatedUser.age}`);
    
    // Update Many Documents
    console.log('\n2️⃣ Update Many (add country field to all):');
    const updateManyResult = await usersCollection.updateMany(
      {},  // Empty filter = all documents
      { $set: { country: 'India' } }
    );
    console.log(`   ✅ Modified: ${updateManyResult.modifiedCount} document(s)`);
    
    // Update with $inc (increment)
    console.log('\n3️⃣ Increment Age (using $inc):');
    await usersCollection.updateOne(
      { email: 'jane.smith@email.com' },
      { $inc: { age: 1 } }  // Increment age by 1
    );
    const janeAfter = await usersCollection.findOne({ email: 'jane.smith@email.com' });
    console.log(`   ✅ Jane's new age: ${janeAfter.age}`);
    
    // Update with $push (add to array)
    console.log('\n4️⃣ Add Interest (using $push):');
    await usersCollection.updateOne(
      { email: 'john.doe@email.com' },
      { $push: { interests: 'photography' } }
    );
    const johnAfter = await usersCollection.findOne({ email: 'john.doe@email.com' });
    console.log(`   ✅ John's interests: ${johnAfter.interests.join(', ')}`);
    
    // Update with $pull (remove from array)
    console.log('\n5️⃣ Remove Interest (using $pull):');
    await usersCollection.updateOne(
      { email: 'john.doe@email.com' },
      { $pull: { interests: 'gaming' } }
    );
    const johnFinal = await usersCollection.findOne({ email: 'john.doe@email.com' });
    console.log(`   ✅ John's interests now: ${johnFinal.interests.join(', ')}`);
    
    // ========================================
    // DELETE OPERATIONS
    // ========================================
    console.log('\n\n🗑️  DELETE OPERATIONS\n');
    console.log('─'.repeat(50));
    
    // // Delete One Document
    // console.log('\n1️⃣ Delete One User:');
    // const deleteOneResult = await usersCollection.deleteOne({
    //   email: 'bob.johnson@email.com'
    // });
    // console.log(`   ✅ Deleted: ${deleteOneResult.deletedCount} document(s)`);
    
    // // Verify deletion
    // const deletedUser = await usersCollection.findOne({ email: 'bob.johnson@email.com' });
    // console.log(`   📊 User exists: ${deletedUser !== null}`);
    
    // // Delete Many Documents
    // console.log('\n2️⃣ Delete Users Over 30:');
    // const deleteManyResult = await usersCollection.deleteMany({
    //   age: { $gt: 30 }
    // });
    // console.log(`   ✅ Deleted: ${deleteManyResult.deletedCount} document(s)`);
    
    // Final Count
    console.log('\n📊 Final Statistics:');
    const finalCount = await usersCollection.countDocuments();
    console.log(`   Total users remaining: ${finalCount}`);
    
    const remainingUsers = await usersCollection.find({}).toArray();
    console.log('   Remaining users:');
    remainingUsers.forEach(user => {
      console.log(`   - ${user.name} (${user.age}) from ${user.city}`);
    });
    
    // Clean up - Delete all test data
    console.log('\n🧹 Cleaning up test data...');
    // await usersCollection.deleteMany({});
    console.log('   ✅ All test data removed\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
    console.log('🔌 Connection closed\n');
  }
}

// Run the operations
runCRUDOperations().catch(console.error);
