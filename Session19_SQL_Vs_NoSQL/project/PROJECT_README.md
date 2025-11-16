# MongoDB Practice Project - Setup Guide 🚀

Complete hands-on MongoDB learning project with progressive examples.

---

## 📁 Project Structure

```
Session19_SQL_Vs_NoSQL/
├── mongodb-examples/          # Progressive MongoDB examples
│   ├── 01-test-connection.js   # ✅ Test your Atlas connection
│   ├── 02-crud-basic.js        # ✅ Learn basic CRUD operations
│   ├── 03-crud-advanced.js     # ✅ Advanced patterns & modeling
│   ├── 04-query-operators.js   # ✅ Master query operators
│   └── 05-aggregation.js       # TODO: Aggregation pipeline
│
├── sql-examples/              # SQL reference queries
│   └── 01-basic-queries.sql    # ✅ Complete SQL query reference
│
├── practice-data/             # Sample data for practice
│   └── seed-mongodb.js         # TODO: Database seeding script
│
├── docs/                      # Documentation
│   ├── MONGODB_ATLAS_SETUP.md  # ✅ Complete Atlas setup guide
│   └── SQL_VS_NOSQL_COMPARISON.md # ✅ Side-by-side comparison
│
├── .env.example               # ✅ Environment template
├── .gitignore                 # ✅ Git ignore rules
├── package.json               # ✅ Project dependencies
└── README.md                  # ✅ Main learning guide
```

---

## 🎯 Learning Path (2-3 hours)

### Phase 1: Setup (15 minutes)

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Set Up MongoDB Atlas**
   - Follow: [MONGODB_ATLAS_SETUP.md](./MONGODB_ATLAS_SETUP.md)
   - Create free account
   - Set up M0 cluster
   - Get connection string

3. **Configure Environment**

   ```bash
   cp .env.example .env
   # Edit .env and add your connection string
   ```

### Phase 2: Connection & Basic CRUD (30 minutes)

**Step 1: Test Connection** (5 mins)

```bash
npm run test-connection
```

Expected Output:

```
🔗 Connecting to MongoDB Atlas...
✅ Connected to MongoDB Atlas!
📚 Available databases: admin, local, skillsflick_db
🧪 Running write test...
✅ Write test successful! Inserted ID: 673c8a9b5f8c9d1234567890
✅ All checks passed!
```

**Step 2: Basic CRUD** (25 mins)

```bash
npm run crud-basic
```

Learn:

- Creating documents (insertOne, insertMany)
- Reading documents (find, findOne)
- Updating documents (updateOne, updateMany)
- Deleting documents (deleteOne, deleteMany)
- Filtering and sorting

### Phase 3: Advanced Patterns (45 minutes)

**Step 3: Advanced CRUD** (30 mins)

```bash
npm run crud-advanced
```

Learn:

- Embedded documents (products with reviews)
- Referenced documents (orders referencing users)
- Bulk operations (bulkWrite)
- Upsert operations
- When to embed vs reference

**Step 4: Query Operators** (15 mins)

```bash
npm run query-operators
```

Learn:

- Comparison operators ($gt, $lt, $in, etc.)
- Logical operators ($and, $or, $nor)
- Element operators ($exists, $type)
- Array operators ($all, $size)
- Sorting, pagination, projection

### Phase 4: Aggregation (45 minutes)

**Step 5: Aggregation Pipeline** (Coming soon)

```bash
npm run aggregation
```

Learn:

- $match - Filtering
- $group - Grouping & calculations
- $project - Reshaping documents
- $sort, $limit - Result control
- $lookup - Joining collections

### Phase 5: Practice with Real Data (30 minutes)

**Step 6: Seed Database** (Coming soon)

```bash
npm run seed-data
```

Creates:

- 50+ sample users
- 100+ products across categories
- 200+ orders
- Reviews and ratings

Then practice all operations on real data!

---

## 📦 npm Scripts Reference

| Command | Description | When to Use |
|---------|-------------|-------------|
| `npm run test-connection` | Test MongoDB connection | First step after setup |
| `npm run crud-basic` | Basic CRUD operations | Learn fundamentals |
| `npm run crud-advanced` | Advanced patterns | Data modeling |
| `npm run query-operators` | Query operators demo | Complex searches |
| `npm run aggregation` | Aggregation examples | Analytics & reports |
| `npm run seed-data` | Populate sample data | Practice on real data |

---

## 🔧 Dependencies

### Production Dependencies

```json
{
  "mongodb": "^6.3.0",  // Official MongoDB Node.js driver
  "dotenv": "^16.3.1"   // Environment variable management
}
```

### Development Dependencies

```json
{
  "nodemon": "^3.0.2"   // Auto-restart during development
}
```

### Why These Packages?

**mongodb** - Official driver for MongoDB

- Native support for all MongoDB features
- Connection pooling
- Promise-based API
- Well-documented

**dotenv** - Secure credential management

- Keeps secrets out of code
- Easy environment switching (dev/prod)
- Industry standard

---

## 🔒 Environment Variables

### Required Variables

Create `.env` file from template:

```bash
cp .env.example .env
```

Edit `.env` with your details:

```env
# MongoDB Connection String
# Get this from MongoDB Atlas dashboard
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/skillsflick_db?retryWrites=true&w=majority

# Replace:
# - username: Your database user
# - password: Your database user password
# - cluster.xxxxx: Your cluster URL
# - skillsflick_db: Your database name (optional, can be anything)
```

### Connection String Breakdown

```
mongodb+srv://  username  :  password  @  cluster-url  /  database  ?  options
     ↓             ↓            ↓            ↓              ↓           ↓
  Protocol    DB User    DB Password   Cluster     Database    Settings
              (Atlas)     (Atlas)       (Atlas)     (Custom)    (Default)
```

### Security Best Practices

✅ **DO:**

- Keep `.env` in `.gitignore`
- Use strong passwords
- Rotate credentials regularly
- Use different credentials for dev/prod

❌ **DON'T:**

- Commit `.env` to git
- Share credentials in chat/email
- Use simple passwords
- Hardcode credentials in code

---

## 🛠️ Troubleshooting Guide

### Issue: "MongoServerError: bad auth"

**Cause:** Incorrect username or password

**Fix:**

1. Go to MongoDB Atlas → Database Access
2. Verify username exists
3. Reset password if needed
4. Update `.env` with new credentials
5. Ensure password is URL-encoded if it contains special characters

Example:

```
Password: P@ssw0rd!   →   URL-encoded: P%40ssw0rd%21
```

---

### Issue: "MongoNetworkError: connect ETIMEDOUT"

**Cause:** IP address not whitelisted or network issue

**Fix:**

1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
   - For production, add specific IP addresses only
4. Wait 2-3 minutes for changes to propagate
5. If on VPN, try disconnecting

---

### Issue: "MongoParseError: Invalid connection string"

**Cause:** Malformed connection string in `.env`

**Fix:**

1. Check for typos in MONGODB_URI
2. Ensure no extra spaces
3. Verify format:

   ```
   mongodb+srv://user:pass@cluster.mongodb.net/db?options
   ```

4. Make sure you replaced `<password>` placeholder
5. Special characters in password must be URL-encoded

---

### Issue: "Cannot find module 'mongodb'"

**Cause:** Dependencies not installed

**Fix:**

```bash
npm install
```

---

### Issue: Database not found

**Cause:** Database is created automatically on first write

**Fix:**

- This is normal! Database appears after first insert
- Just run any example that creates data
- Check Atlas dashboard after running examples

---

### Issue: "Too many connections"

**Cause:** Not closing MongoDB connections

**Fix:**

- Ensure `await client.close()` is called
- Free tier limit: 100 connections
- Wait a few minutes for connections to close
- Use connection pooling (built into driver)

---

## 📚 File Descriptions

### MongoDB Examples

**01-test-connection.js** (100+ lines)

- Verifies MongoDB Atlas connection
- Lists databases and collections
- Performs write test
- Provides troubleshooting hints
- **Run first** to ensure setup is correct

**02-crud-basic.js** (300+ lines)

- Comprehensive CRUD operations
- User management example
- Demonstrates:
  - insertOne(), insertMany()
  - find(), findOne()
  - Filtering, sorting, limiting
  - updateOne(), updateMany()
  - deleteOne(), deleteMany()
- **Start here** for learning MongoDB

**03-crud-advanced.js** (400+ lines)

- Real-world e-commerce patterns
- Embedded documents (reviews in products)
- Referenced documents (orders referencing users)
- Bulk operations (bulkWrite)
- Upsert operations
- Aggregation preview
- **Important** for data modeling decisions

**04-query-operators.js** (350+ lines)

- Complete query operator reference
- Comparison operators ($eq, $ne, $gt, $gte, $lt, $lte, $in, $nin)
- Logical operators ($and, $or, $nor, $not)
- Element operators ($exists, $type)
- Array operators ($all, $size)
- Sorting, pagination, projection
- Product catalog example
- **Master queries** for complex searches

**05-aggregation.js** (Coming soon)

- Aggregation pipeline stages
- $match, $group, $project
- $sort, $limit, $skip
- $lookup (joins)
- Analytics examples
- **Advanced** data transformation

### SQL Examples

**01-basic-queries.sql** (400+ lines)

- Complete SQL reference
- CREATE, INSERT, SELECT, UPDATE, DELETE
- JOINs (INNER, LEFT, RIGHT, FULL)
- Aggregations (COUNT, SUM, AVG, MAX, MIN)
- GROUP BY, HAVING
- Subqueries
- Transactions
- Indexes
- **Compare** with MongoDB examples

### Documentation

**MONGODB_ATLAS_SETUP.md** (500+ lines)

- Step-by-step Atlas setup
- Screenshots and detailed instructions
- Network access configuration
- Database user creation
- Connection string guide
- Troubleshooting common issues
- **Complete guide** for beginners

**SQL_VS_NOSQL_COMPARISON.md** (600+ lines)

- Side-by-side query comparisons
- Same operation in SQL and MongoDB
- When to use each database
- Performance considerations
- Best practices
- **Essential** for understanding differences

---

## 🎓 Learning Tips

### For Beginners

1. **Follow the order**: Start with 01, then 02, etc.
2. **Read the code**: Each file has detailed comments
3. **Run the examples**: See output in your terminal
4. **Experiment**: Modify the code and see what happens
5. **Check MongoDB Atlas**: View data in the UI

### Effective Practice

1. **Read documentation first** (in each file)
2. **Run the complete example**
3. **Modify and re-run** with different data
4. **Compare SQL vs MongoDB** approach
5. **Build small projects** using patterns learned

### Common Mistakes to Avoid

❌ Skipping the test-connection step
❌ Not reading error messages carefully
❌ Forgetting to close connections
❌ Not using try-catch for error handling
❌ Hardcoding credentials in code

✅ Test connection first
✅ Read errors and troubleshoot
✅ Always close connections
✅ Handle errors properly
✅ Use environment variables

---

## 🎯 Practice Exercises

### Exercise 1: User System

Build a user management system:

```javascript
// Tasks:
// 1. Create 10 users with different ages and cities
// 2. Find all users older than 25
// 3. Update users from "Delhi" to set country = "India"
// 4. Delete inactive users (lastLogin > 90 days ago)
// 5. Count users per city
```

**Hint:** Use examples from `02-crud-basic.js`

---

### Exercise 2: Blog System

Create a simple blog:

```javascript
// Tasks:
// 1. Create users collection
// 2. Create posts collection (with userId reference)
// 3. Add comments to posts (embedded in post)
// 4. Find all posts by a user
// 5. Find posts with more than 5 comments
// 6. Calculate average comments per post
```

**Hint:** Use patterns from `03-crud-advanced.js`

---

### Exercise 3: E-Commerce Catalog

Build a product catalog:

```javascript
// Tasks:
// 1. Create 20 products across 4 categories
// 2. Add reviews to products (embedded)
// 3. Find products under ₹1000
// 4. Find electronics with rating > 4.0
// 5. Calculate average price per category
// 6. Find top 5 most reviewed products
```

**Hint:** Use queries from `04-query-operators.js`

---

### Exercise 4: Analytics Dashboard

Create sales analytics:

```javascript
// Tasks:
// 1. Create orders collection
// 2. Calculate total sales
// 3. Find best-selling products
// 4. Monthly sales report
// 5. Top customers by order value
// 6. Products low in stock (< 10)
```

**Hint:** Will use aggregation (coming soon)

---

## 🔗 External Resources

### Official Documentation

- [MongoDB Manual](https://docs.mongodb.com/manual/) - Complete reference
- [MongoDB Node.js Driver](https://mongodb.github.io/node-mongodb-native/) - Driver docs
- [MongoDB University](https://university.mongodb.com/) - Free courses

### Interactive Learning

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Free cloud database
- [MongoDB Playground](https://mongoplayground.net/) - Test queries online

### SQL Resources

- [W3Schools SQL](https://www.w3schools.com/sql/) - SQL tutorial
- [SQLBolt](https://sqlbolt.com/) - Interactive SQL lessons

### Comparison Guides

- [SQL to MongoDB Mapping](https://docs.mongodb.com/manual/reference/sql-comparison/)
- [MongoDB vs MySQL](https://www.mongodb.com/compare/mongodb-mysql)

---

## 📊 Progress Checklist

### Setup ✅

- [ ] Installed Node.js (v14+)
- [ ] Created MongoDB Atlas account
- [ ] Set up M0 free cluster
- [ ] Configured network access (0.0.0.0/0)
- [ ] Created database user
- [ ] Got connection string
- [ ] Ran `npm install`
- [ ] Created `.env` with connection string
- [ ] Successfully ran `npm run test-connection`

### Learning Progress 📚

- [ ] Completed 01-test-connection
- [ ] Completed 02-crud-basic
- [ ] Completed 03-crud-advanced
- [ ] Completed 04-query-operators
- [ ] Completed 05-aggregation (coming soon)
- [ ] Ran seed-data script (coming soon)
- [ ] Read SQL_VS_NOSQL_COMPARISON.md
- [ ] Completed practice exercises

### Understanding ✨

- [ ] Know when to use SQL vs NoSQL
- [ ] Understand embedded vs referenced documents
- [ ] Can write basic CRUD operations
- [ ] Can use query operators
- [ ] Understand aggregation basics
- [ ] Know how to model data in MongoDB
- [ ] Can compare SQL and MongoDB queries

---

## 🚀 Next Steps

After completing this project:

1. **MongoDB Compass**
   - Download and install visual GUI
   - Connect to your Atlas cluster
   - Explore data visually

2. **Mongoose ODM**
   - Learn schema validation
   - Use models and middleware
   - Build with TypeScript

3. **Build Real Projects**
   - Todo app with MongoDB
   - Blog with comments
   - E-commerce API
   - Social media backend

4. **Advanced Topics**
   - Indexes and performance
   - Replication and sharding
   - Transactions
   - Change streams
   - Full-text search

---

## 💡 Tips for Success

### Writing Clean Code

```javascript
// ✅ Good: Descriptive names, error handling, comments
async function getUsersByCity(city) {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('mydb');
    const users = await db.collection('users')
      .find({ city: city })
      .toArray();
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  } finally {
    await client.close();
  }
}

// ❌ Bad: No error handling, connection not closed
async function getUsers(c) {
  const client = new MongoClient('mongodb+srv://...');
  await client.connect();
  const users = await client.db('db').collection('users').find({city:c}).toArray();
  return users;
}
```

### Performance Tips

- ✅ Create indexes on frequently queried fields
- ✅ Use projection to limit returned fields
- ✅ Limit query results when possible
- ✅ Close connections after use
- ✅ Reuse connection in production (connection pooling)

---

## 🤝 Getting Help

Stuck? Here's how to get help:

1. **Read error messages** - They usually tell you what's wrong
2. **Check troubleshooting guide** - Common issues covered above
3. **MongoDB Forums** - [MongoDB Community](https://www.mongodb.com/community/forums/)
4. **Stack Overflow** - Tag: `mongodb`, `mongodb-query`
5. **MongoDB Discord** - Real-time community help

When asking for help, include:

- Error message (full stack trace)
- Code snippet (minimal reproducible example)
- What you've tried so far
- Expected vs actual behavior

---

## 📝 License

Educational project for SkillsFlick.com Web Development Course.

---

## ✨ Credits

**Created for:** SkillsFlick.com - Session 19  
**Topic:** SQL vs NoSQL - Database Fundamentals  
**Instructor:** [Your Name]  
**Date:** November 2024

---

**Happy Learning! 🎉**

Need help? Check troubleshooting guide or ask in community forums.

Ready to become a database expert? Start with `npm run test-connection`! 🚀
