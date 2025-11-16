/**
 * 04 - MongoDB Query Operators
 * 
 * Comprehensive guide to MongoDB query operators
 * Run: npm run query-operators
 */

require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function demonstrateQueryOperators() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas\n');
    
    const db = client.db(process.env.DB_NAME || 'session19_practice');
    const usersCollection = db.collection('users');
    
    // Insert sample data
    console.log('📝 Inserting sample data...\n');
    
    const sampleUsers = [
      { name: 'Alice', age: 25, city: 'Chennai', salary: 50000, active: true, skills: ['JavaScript', 'React'], joinDate: new Date('2023-01-15') },
      { name: 'Bob', age: 30, city: 'Mumbai', salary: 75000, active: true, skills: ['Python', 'Django', 'SQL'], joinDate: new Date('2022-06-20') },
      { name: 'Charlie', age: 28, city: 'Delhi', salary: 60000, active: false, skills: ['Java', 'Spring'], joinDate: new Date('2023-03-10') },
      { name: 'Diana', age: 35, city: 'Bangalore', salary: 90000, active: true, skills: ['JavaScript', 'Node.js', 'MongoDB'], joinDate: new Date('2021-11-05') },
      { name: 'Eve', age: 22, city: 'Chennai', salary: 45000, active: true, skills: ['React', 'CSS'], joinDate: new Date('2023-08-01') },
      { name: 'Frank', age: 40, city: 'Pune', salary: 100000, active: true, skills: ['Python', 'Machine Learning'], joinDate: new Date('2020-02-14') },
      { name: 'Grace', age: 27, city: 'Mumbai', salary: 55000, active: false, skills: ['JavaScript'], joinDate: new Date('2023-05-22') },
      { name: 'Henry', age: 33, city: 'Bangalore', salary: 85000, active: true, skills: ['Go', 'Docker', 'Kubernetes'], joinDate: new Date('2022-01-30') }
    ];
    
    await usersCollection.insertMany(sampleUsers);
    console.log(`✅ Inserted ${sampleUsers.length} users\n`);
    
    console.log('🔍 MONGODB QUERY OPERATORS\n');
    console.log('═'.repeat(70));
    
    // ========================================
    // COMPARISON OPERATORS
    // ========================================
    console.log('\n📊 COMPARISON OPERATORS\n');
    console.log('─'.repeat(70));
    
    // $eq - Equal to
    console.log('\n1️⃣ $eq (Equal to) - Find users from Chennai:');
    const chennaiUsers = await usersCollection.find({ city: { $eq: 'Chennai' } }).toArray();
    // Shorthand: { city: 'Chennai' }
    console.log(`   Found ${chennaiUsers.length} user(s):`);
    chennaiUsers.forEach(u => console.log(`   - ${u.name}`));
    
    // $ne - Not equal to
    console.log('\n2️⃣ $ne (Not equal to) - Find users not from Mumbai:');
    const nonMumbaiUsers = await usersCollection.find({ city: { $ne: 'Mumbai' } }).toArray();
    console.log(`   Found ${nonMumbaiUsers.length} user(s):`);
    nonMumbaiUsers.forEach(u => console.log(`   - ${u.name} (${u.city})`));
    
    // $gt - Greater than
    console.log('\n3️⃣ $gt (Greater than) - Find users with age > 30:');
    const olderUsers = await usersCollection.find({ age: { $gt: 30 } }).toArray();
    console.log(`   Found ${olderUsers.length} user(s):`);
    olderUsers.forEach(u => console.log(`   - ${u.name}: ${u.age} years`));
    
    // $gte - Greater than or equal
    console.log('\n4️⃣ $gte (Greater than or equal) - Find users with age >= 30:');
    const thirtyPlusUsers = await usersCollection.find({ age: { $gte: 30 } }).toArray();
    console.log(`   Found ${thirtyPlusUsers.length} user(s):`);
    thirtyPlusUsers.forEach(u => console.log(`   - ${u.name}: ${u.age} years`));
    
    // $lt - Less than
    console.log('\n5️⃣ $lt (Less than) - Find users with salary < 60000:');
    const lowerSalaryUsers = await usersCollection.find({ salary: { $lt: 60000 } }).toArray();
    console.log(`   Found ${lowerSalaryUsers.length} user(s):`);
    lowerSalaryUsers.forEach(u => console.log(`   - ${u.name}: ₹${u.salary}`));
    
    // $lte - Less than or equal
    console.log('\n6️⃣ $lte (Less than or equal) - Find users with age <= 28:');
    const youngUsers = await usersCollection.find({ age: { $lte: 28 } }).toArray();
    console.log(`   Found ${youngUsers.length} user(s):`);
    youngUsers.forEach(u => console.log(`   - ${u.name}: ${u.age} years`));
    
    // $in - In array
    console.log('\n7️⃣ $in (Value in array) - Find users from Chennai, Mumbai, or Delhi:');
    const selectedCityUsers = await usersCollection.find({
      city: { $in: ['Chennai', 'Mumbai', 'Delhi'] }
    }).toArray();
    console.log(`   Found ${selectedCityUsers.length} user(s):`);
    selectedCityUsers.forEach(u => console.log(`   - ${u.name} (${u.city})`));
    
    // $nin - Not in array
    console.log('\n8️⃣ $nin (Value not in array) - Find users NOT from Chennai or Mumbai:');
    const otherCityUsers = await usersCollection.find({
      city: { $nin: ['Chennai', 'Mumbai'] }
    }).toArray();
    console.log(`   Found ${otherCityUsers.length} user(s):`);
    otherCityUsers.forEach(u => console.log(`   - ${u.name} (${u.city})`));
    
    // ========================================
    // LOGICAL OPERATORS
    // ========================================
    console.log('\n\n🧮 LOGICAL OPERATORS\n');
    console.log('─'.repeat(70));
    
    // $and - All conditions must be true
    console.log('\n1️⃣ $and - Find active users from Chennai with age > 24:');
    const andUsers = await usersCollection.find({
      $and: [
        { active: true },
        { city: 'Chennai' },
        { age: { $gt: 24 } }
      ]
    }).toArray();
    // Shorthand: { active: true, city: 'Chennai', age: { $gt: 24 } }
    console.log(`   Found ${andUsers.length} user(s):`);
    andUsers.forEach(u => console.log(`   - ${u.name}: ${u.age} years`));
    
    // $or - At least one condition must be true
    console.log('\n2️⃣ $or - Find users from Chennai OR with salary > 80000:');
    const orUsers = await usersCollection.find({
      $or: [
        { city: 'Chennai' },
        { salary: { $gt: 80000 } }
      ]
    }).toArray();
    console.log(`   Found ${orUsers.length} user(s):`);
    orUsers.forEach(u => console.log(`   - ${u.name} (${u.city}, ₹${u.salary})`));
    
    // $nor - Neither condition is true
    console.log('\n3️⃣ $nor - Find users neither from Chennai NOR Mumbai:');
    const norUsers = await usersCollection.find({
      $nor: [
        { city: 'Chennai' },
        { city: 'Mumbai' }
      ]
    }).toArray();
    console.log(`   Found ${norUsers.length} user(s):`);
    norUsers.forEach(u => console.log(`   - ${u.name} (${u.city})`));
    
    // $not - Negation
    console.log('\n4️⃣ $not - Find users NOT older than 30:');
    const notOldUsers = await usersCollection.find({
      age: { $not: { $gt: 30 } }
    }).toArray();
    console.log(`   Found ${notOldUsers.length} user(s):`);
    notOldUsers.forEach(u => console.log(`   - ${u.name}: ${u.age} years`));
    
    // ========================================
    // ELEMENT OPERATORS
    // ========================================
    console.log('\n\n🔖 ELEMENT OPERATORS\n');
    console.log('─'.repeat(70));
    
    // $exists - Check if field exists
    console.log('\n1️⃣ $exists - Find documents with active field:');
    const withActiveField = await usersCollection.find({
      active: { $exists: true }
    }).toArray();
    console.log(`   Found ${withActiveField.length} user(s) with active field`);
    
    // $type - Check field type
    console.log('\n2️⃣ $type - Find users where age is a number:');
    const numericAge = await usersCollection.find({
      age: { $type: 'number' }
    }).toArray();
    console.log(`   Found ${numericAge.length} user(s) with numeric age`);
    
    // ========================================
    // ARRAY OPERATORS
    // ========================================
    console.log('\n\n📋 ARRAY OPERATORS\n');
    console.log('─'.repeat(70));
    
    // Array contains value
    console.log('\n1️⃣ Array contains - Find users with JavaScript skill:');
    const jsUsers = await usersCollection.find({
      skills: 'JavaScript'
    }).toArray();
    console.log(`   Found ${jsUsers.length} JavaScript developer(s):`);
    jsUsers.forEach(u => console.log(`   - ${u.name}: [${u.skills.join(', ')}]`));
    
    // $all - Array contains all values
    console.log('\n2️⃣ $all - Find users with both JavaScript AND React:');
    const jsReactUsers = await usersCollection.find({
      skills: { $all: ['JavaScript', 'React'] }
    }).toArray();
    console.log(`   Found ${jsReactUsers.length} user(s):`);
    jsReactUsers.forEach(u => console.log(`   - ${u.name}: [${u.skills.join(', ')}]`));
    
    // $size - Array has exact size
    console.log('\n3️⃣ $size - Find users with exactly 2 skills:');
    const twoSkillUsers = await usersCollection.find({
      skills: { $size: 2 }
    }).toArray();
    console.log(`   Found ${twoSkillUsers.length} user(s):`);
    twoSkillUsers.forEach(u => console.log(`   - ${u.name}: [${u.skills.join(', ')}]`));
    
    // $elemMatch - Array element matches conditions
    console.log('\n4️⃣ $elemMatch - Complex array matching (for array of objects):');
    // Note: Our current data doesn't have array of objects, so this is a demonstration
    console.log('   (See advanced examples for array of embedded documents)');
    
    // ========================================
    // COMBINED QUERIES
    // ========================================
    console.log('\n\n🎯 COMBINED QUERIES (Real-World Examples)\n');
    console.log('─'.repeat(70));
    
    // Example 1: Active users in specific cities with good salary
    console.log('\n1️⃣ Active users from Chennai/Mumbai with salary >= 50000:');
    const premiumUsers = await usersCollection.find({
      active: true,
      city: { $in: ['Chennai', 'Mumbai'] },
      salary: { $gte: 50000 }
    }).toArray();
    console.log(`   Found ${premiumUsers.length} user(s):`);
    premiumUsers.forEach(u => {
      console.log(`   - ${u.name}: ${u.city}, ₹${u.salary}, Skills: [${u.skills.join(', ')}]`);
    });
    
    // Example 2: JavaScript developers in top 3 cities
    console.log('\n2️⃣ JavaScript developers in Chennai, Mumbai, or Bangalore:');
    const jsDevelopers = await usersCollection.find({
      skills: 'JavaScript',
      city: { $in: ['Chennai', 'Mumbai', 'Bangalore'] }
    }).sort({ salary: -1 }).toArray();
    console.log(`   Found ${jsDevelopers.length} developer(s) (sorted by salary):`);
    jsDevelopers.forEach(u => {
      console.log(`   - ${u.name}: ${u.city}, ₹${u.salary}`);
    });
    
    // Example 3: Mid-career professionals
    console.log('\n3️⃣ Mid-career professionals (age 28-35, salary 60K-90K):');
    const midCareer = await usersCollection.find({
      age: { $gte: 28, $lte: 35 },
      salary: { $gte: 60000, $lte: 90000 }
    }).toArray();
    console.log(`   Found ${midCareer.length} professional(s):`);
    midCareer.forEach(u => {
      console.log(`   - ${u.name}: ${u.age} yrs, ₹${u.salary}`);
    });
    
    // ========================================
    // SORTING, LIMITING, SKIPPING
    // ========================================
    console.log('\n\n📊 SORTING, LIMITING & PAGINATION\n');
    console.log('─'.repeat(70));
    
    // Sorting
    console.log('\n1️⃣ Top 3 earners:');
    const topEarners = await usersCollection
      .find({})
      .sort({ salary: -1 })  // -1 for descending
      .limit(3)
      .toArray();
    topEarners.forEach((u, i) => {
      console.log(`   ${i + 1}. ${u.name}: ₹${u.salary}`);
    });
    
    // Multiple sort fields
    console.log('\n2️⃣ Users sorted by city (asc), then salary (desc):');
    const sortedMultiple = await usersCollection
      .find({})
      .sort({ city: 1, salary: -1 })
      .toArray();
    sortedMultiple.forEach(u => {
      console.log(`   - ${u.city.padEnd(12)} | ${u.name.padEnd(10)} | ₹${u.salary}`);
    });
    
    // Pagination example
    console.log('\n3️⃣ Pagination (Page 2, 3 results per page):');
    const page = 2;
    const pageSize = 3;
    const paginatedUsers = await usersCollection
      .find({})
      .sort({ name: 1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();
    console.log(`   Showing results ${(page - 1) * pageSize + 1}-${page * pageSize}:`);
    paginatedUsers.forEach(u => {
      console.log(`   - ${u.name}`);
    });
    
    // ========================================
    // PROJECTION (SELECT SPECIFIC FIELDS)
    // ========================================
    console.log('\n\n🎯 PROJECTION (Select Specific Fields)\n');
    console.log('─'.repeat(70));
    
    // Include specific fields
    console.log('\n1️⃣ Show only name and salary:');
    const nameAndSalary = await usersCollection
      .find({}, { projection: { name: 1, salary: 1, _id: 0 } })
      .toArray();
    nameAndSalary.forEach(u => {
      console.log(`   - ${u.name}: ₹${u.salary}`);
    });
    
    // Exclude specific fields
    console.log('\n2️⃣ Show all fields except skills and joinDate:');
    const withoutSkills = await usersCollection
      .find({}, { projection: { skills: 0, joinDate: 0 } })
      .limit(2)
      .toArray();
    withoutSkills.forEach(u => {
      console.log(`   - ${u.name}: ${u.age} yrs, ${u.city}, ₹${u.salary}, Active: ${u.active}`);
    });
    
    // ========================================
    // COUNT & AGGREGATION BASICS
    // ========================================
    console.log('\n\n🔢 COUNT & STATISTICS\n');
    console.log('─'.repeat(70));
    
    // Count documents
    console.log('\n1️⃣ Document counts:');
    const totalUsers = await usersCollection.countDocuments();
    const activeUsers = await usersCollection.countDocuments({ active: true });
    const chennaiCount = await usersCollection.countDocuments({ city: 'Chennai' });
    console.log(`   Total users: ${totalUsers}`);
    console.log(`   Active users: ${activeUsers}`);
    console.log(`   Users in Chennai: ${chennaiCount}`);
    
    // Distinct values
    console.log('\n2️⃣ Distinct cities:');
    const cities = await usersCollection.distinct('city');
    console.log(`   Cities: ${cities.join(', ')}`);
    
    console.log('\n3️⃣ Distinct skills:');
    const allSkills = await usersCollection.distinct('skills');
    console.log(`   Skills: ${allSkills.join(', ')}`);
    
    // ========================================
    // SUMMARY
    // ========================================
    console.log('\n\n📖 QUERY OPERATORS SUMMARY\n');
    console.log('─'.repeat(70));
    console.log(`
   Comparison: $eq, $ne, $gt, $gte, $lt, $lte, $in, $nin
   Logical:    $and, $or, $nor, $not
   Element:    $exists, $type
   Array:      array-value, $all, $size, $elemMatch
   Modifiers:  .sort(), .limit(), .skip(), projection
   Count:      .countDocuments(), .distinct()
    `);
    
    // Clean up
    console.log('\n🧹 Cleaning up test data...');
    // await usersCollection.deleteMany({});
    console.log('✅ All test data removed\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
    console.log('🔌 Connection closed\n');
  }
}

// Run the demonstrations
demonstrateQueryOperators().catch(console.error);
