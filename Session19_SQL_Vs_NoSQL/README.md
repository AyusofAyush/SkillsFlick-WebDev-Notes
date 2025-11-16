# Session 19: Database Fundamentals - SQL vs NoSQL 🗄️

## Welcome to the World of Persistent Data! 🎯

---

## 📚 Table of Contents

1. [Why We Need Databases](#why-databases)
2. [Understanding Database Types](#database-types)
3. [SQL Databases Deep Dive](#sql-databases)
4. [NoSQL Databases Deep Dive](#nosql-databases)
5. [SQL vs NoSQL Comparison](#comparison)
6. [MongoDB Fundamentals](#mongodb-fundamentals)
7. [MongoDB Atlas Setup](#mongodb-atlas)
8. [SQL Query Basics](#sql-queries)
9. [MongoDB Operations](#mongodb-operations)
10. [Hands-On Practice](#practice)

---

## 🎯 Learning Objectives

By the end of this session, you will be able to:

* ✅ Understand why databases are needed for persistent storage.
* ✅ Differentiate SQL (relational) vs NoSQL (document-based) systems.
* ✅ Know the essentials of relational databases: tables, columns, rows, primary keys, foreign keys.
* ✅ Understand how NoSQL databases use collections and flexible document structures.
* ✅ Identify when SQL fits best (ACID, relationships, structured data).
* ✅ Identify when NoSQL fits best (flexibility, rapid iteration, horizontal scaling).
* ✅ Write basic SQL queries (SELECT, INSERT, UPDATE, DELETE). Perform SQL JOINs to relate data across tables.
* ✅ Use MongoDB CRUD operations (insertOne, find, updateOne, deleteOne). Apply MongoDB operators for filtering, sorting, and limiting results.
* ✅ Understand MongoDB’s document model with embedded and referenced structures. Design data models using embedded vs referenced documents.
* ✅ Build a simple Node.js application backed by MongoDB.

---

## 🤔 Why We Need Databases? {#why-databases}

### The Problem We've Been Facing

Remember all our previous sessions? We've been storing data like this:

```javascript
// In-memory storage (what we've been doing)
let users = [];
let posts = [];
let products = [];

// What happens when the server restarts? 💥
// ALL DATA IS LOST! 😱
```

### Real-World Analogy 🏪

Imagine running a store where:

* **In-memory storage** = Writing customer orders on a whiteboard
  * Fast ✅
  * Easy ✅
  * Disappears when you close the store ❌
  * Can't handle thousands of orders ❌

* **Database storage** = Filing system with organized cabinets
  * Permanent ✅
  * Can handle millions of records ✅
  * Searchable and organized ✅
  * Survives store closure ✅

### What Databases Provide

```mermaid
graph TB
    A[Database Benefits] --> B[Persistence]
    A --> C[Scalability]
    A --> D[Query Power]
    A --> E[Concurrent Access]
    A --> F[Data Integrity]
    
    B --> B1[Data survives restarts]
    C --> C1[Handle millions of records]
    D --> D1[Complex searches & filters]
    E --> E1[Multiple users simultaneously]
    F --> F1[Relationships & constraints]
    
    style A fill:#4CAF50,color:#fff
    style B fill:#2196F3,color:#fff
    style C fill:#2196F3,color:#fff
    style D fill:#2196F3,color:#fff
    style E fill:#2196F3,color:#fff
    style F fill:#2196F3,color:#fff
```

---

## 🗂️ Understanding Database Types {#database-types}

### The Two Main Families

```mermaid
graph LR
    A[Databases] --> B[SQL/Relational]
    A --> C[NoSQL]
    
    B --> B1[MySQL]
    B --> B2[PostgreSQL]
    B --> B3[SQLite]
    B --> B4[Oracle]
    
    C --> C1[MongoDB - Document]
    C --> C2[Redis - Key-Value]
    C --> C3[Cassandra - Wide Column]
    C --> C4[Neo4j - Graph]
    
    style A fill:#FF9800,color:#fff
    style B fill:#2196F3,color:#fff
    style C fill:#4CAF50,color:#fff
```

### Quick Overview

| Aspect | SQL | NoSQL |
|--------|-----|-------|
| **Structure** | Tables with fixed columns | Flexible documents/collections |
| **Schema** | Predefined, strict | Dynamic, flexible |
| **Relationships** | Strong (JOINs) | Weak (embedded or referenced) |
| **Scaling** | Vertical (bigger servers) | Horizontal (more servers) |
| **Best For** | Complex relationships | Rapid development, flexibility |

---

## 🏗️ SQL Databases Deep Dive {#sql-databases}

### The Restaurant Menu Analogy 🍽️

Think of a SQL database like a traditional restaurant:

* **Tables** = Different sections (Appetizers, Main Course, Desserts)
* **Rows** = Individual menu items
* **Columns** = Properties (Name, Price, Ingredients, Calories)
* **Relationships** = "This dessert goes well with this main course"

### Structure: Tables, Rows, and Columns

```mermaid
erDiagram
    CUSTOMERS ||--o{ ORDERS : places
    ORDERS ||--|{ ORDER_ITEMS : contains
    PRODUCTS ||--o{ ORDER_ITEMS : includes
    
    CUSTOMERS {
        int id PK
        string name
        string email
        string phone
        date created_at
    }
    
    ORDERS {
        int id PK
        int customer_id FK
        decimal total
        string status
        date order_date
    }
    
    ORDER_ITEMS {
        int id PK
        int order_id FK
        int product_id FK
        int quantity
        decimal price
    }
    
    PRODUCTS {
        int id PK
        string name
        string description
        decimal price
        int stock
    }
```

### Real Example: E-Commerce Database

**Customers Table:**

```
+----+-------------+----------------------+---------------+
| id | name        | email                | phone         |
+----+-------------+----------------------+---------------+
| 1  | John Doe    | john@email.com       | 555-0101      |
| 2  | Jane Smith  | jane@email.com       | 555-0102      |
| 3  | Bob Johnson | bob@email.com        | 555-0103      |
+----+-------------+----------------------+---------------+
```

**Orders Table:**

```
+----+-------------+--------+------------+------------+
| id | customer_id | total  | status     | order_date |
+----+-------------+--------+------------+------------+
| 1  | 1           | 129.99 | completed  | 2024-11-01 |
| 2  | 1           | 49.99  | shipped    | 2024-11-10 |
| 3  | 2           | 89.99  | processing | 2024-11-14 |
+----+-------------+--------+------------+------------+
```

**Products Table:**

```
+----+------------------+-------+-------+
| id | name             | price | stock |
+----+------------------+-------+-------+
| 1  | Wireless Mouse   | 29.99 | 150   |
| 2  | USB-C Cable      | 19.99 | 300   |
| 3  | Laptop Stand     | 79.99 | 75    |
+----+------------------+-------+-------+
```

### Key SQL Concepts

#### 1. **Primary Keys (PK)** 🔑

* Unique identifier for each row
* Like an Aadhaar number for data
* Example: `customer_id`, `order_id`

#### 2. **Foreign Keys (FK)** 🔗

* Creates relationships between tables
* References primary key in another table
* Example: `customer_id` in Orders table references Customers table

#### 3. **Relationships**

```mermaid
graph LR
    A[One-to-One] --> A1["User ↔️ Profile<br/>One user has one profile"]
    B[One-to-Many] --> B1["Customer ↔️ Orders<br/>One customer has many orders"]
    C[Many-to-Many] --> C1["Students ↔️ Courses<br/>Many students in many courses"]
    
    style A fill:#E91E63,color:#fff
    style B fill:#9C27B0,color:#fff
    style C fill:#673AB7,color:#fff
```

### Advantages of SQL

✅ **ACID Compliance** (Atomicity, Consistency, Isolation, Durability)

* Bank transactions are safe
* Data integrity guaranteed

✅ **Powerful Queries**

* Complex JOINs
* Aggregations (SUM, AVG, COUNT)
* Subqueries

✅ **Mature Ecosystem**

* 40+ years of development
* Extensive tooling
* Large community

### Disadvantages of SQL

❌ **Rigid Schema**

* Must define structure upfront
* Changes require migrations

❌ **Scaling Challenges**

* Vertical scaling (expensive)
* Horizontal scaling (complex)

❌ **Complex for Hierarchical Data**

* JSON-like structures are awkward

---

## 🍃 NoSQL Databases Deep Dive {#nosql-databases}

### The Flexible Notebook Analogy 📓

Think of NoSQL like a digital notebook:

* **No fixed format** = Write notes however you want
* **Flexible structure** = Each page can be different
* **Easy to organize** = Group related notes together
* **Quick access** = Find by tags or keywords

### MongoDB: Document Database

MongoDB stores data in **documents** (similar to JSON):

```javascript
// A MongoDB document - looks like a JavaScript object!
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "John Doe",
  email: "john@email.com",
  age: 28,
  address: {
    street: "123 Main St",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600001"
  },
  interests: ["coding", "gaming", "music"],
  orders: [
    {
      orderId: "ORD-001",
      date: "2024-11-01",
      total: 129.99,
      items: [
        { product: "Wireless Mouse", quantity: 1, price: 29.99 },
        { product: "Laptop Stand", quantity: 1, price: 79.99 }
      ]
    }
  ],
  createdAt: ISODate("2024-01-15T10:30:00Z")
}
```

### Document Structure

```mermaid
graph TB
    A[MongoDB Database] --> B[Collections]
    B --> C1[users collection]
    B --> C2[products collection]
    B --> C3[orders collection]
    
    C1 --> D1[User Document 1]
    C1 --> D2[User Document 2]
    C1 --> D3[User Document 3]
    
    D1 --> E[Fields can vary!]
    D2 --> E
    D3 --> E
    
    E --> F1[name: 'John']
    E --> F2[age: 28]
    E --> F3[email: 'john@email.com']
    E --> F4[Extra fields OK!]
    
    style A fill:#4CAF50,color:#fff
    style B fill:#2196F3,color:#fff
    style E fill:#FF9800,color:#fff
```

### BSON Format (Binary JSON)

MongoDB actually uses **BSON** (Binary JSON):

```javascript
// JSON (what you write)
{
  "name": "John",
  "age": 28,
  "active": true
}

// BSON (how MongoDB stores it)
// - More data types: Date, ObjectId, Binary
// - Faster to parse
// - Efficient storage
```

**Additional BSON Types:**

* `ObjectId` - Unique identifier (like auto-increment ID)
* `Date` - Proper date/time objects
* `Binary` - Store files and binary data
* `NumberDecimal` - Precise decimal numbers (for money)
* `Array` - Lists of values
* `Embedded Document` - Nested objects

### Advantages of NoSQL (MongoDB)

✅ **Flexible Schema**

```javascript
// Document 1
{ name: "John", age: 28 }

// Document 2 - different structure is OK!
{ name: "Jane", age: 32, city: "Mumbai", skills: ["Node.js", "React"] }
```

✅ **Natural for Developers**

* Looks like JavaScript objects
* Easy to work with in code

✅ **Horizontal Scaling**

* Add more servers easily
* Sharding built-in

✅ **Fast for Reads**

* Data is already together
* No JOINs needed

### Disadvantages of NoSQL

❌ **No ACID by default** (though MongoDB added support)
❌ **Data duplication** (same data in multiple places)
❌ **No complex JOINs** (must do in application code)
❌ **Eventual consistency** (in distributed setups)

---

## ⚖️ SQL vs NoSQL Comparison {#comparison}

### Decision Matrix

```mermaid
graph TD
    A[Choosing a Database] --> B{Data Structure?}
    B -->|Fixed, relational| C[SQL]
    B -->|Flexible, hierarchical| D[NoSQL]
    
    C --> E{ACID critical?}
    E -->|Yes - Banking| C1[PostgreSQL/MySQL]
    E -->|No| D
    
    D --> F{Scaling needs?}
    F -->|Horizontal scaling| D1[MongoDB/Cassandra]
    F -->|Vertical scaling OK| C
    
    style A fill:#FF9800,color:#fff
    style C fill:#2196F3,color:#fff
    style D fill:#4CAF50,color:#fff
```

### Use Case Examples

#### ✅ Use SQL When

**1. Banking Application 🏦**

```
- Account balances must be exact
- Transactions need ACID compliance
- Complex relationships (accounts, transactions, users)
- Regulatory compliance required
```

**2. E-Commerce with Inventory 🛒**

```
- Product quantities must be accurate
- Complex queries (reports, analytics)
- Multiple table relationships
- Financial data
```

**3. Enterprise ERP Systems 🏢**

```
- Complex business logic
- Multiple departments sharing data
- Strong consistency requirements
- Audit trails
```

#### ✅ Use NoSQL When

**1. Social Media Application 📱**

```javascript
// User posts with comments, likes, shares
{
  postId: "123",
  author: { id: 1, name: "John" },
  content: "My first post!",
  comments: [
    { user: "Jane", text: "Nice!" },
    { user: "Bob", text: "Welcome!" }
  ],
  likes: 42,
  shares: 5
}
```

**2. Real-time Analytics Dashboard 📊**

```
- High write throughput
- Flexible schema for different events
- Fast reads for recent data
- Scalability for millions of events
```

**3. Content Management System 📝**

```
- Different content types
- Hierarchical data (categories, tags)
- Rapid development cycles
- Flexible schemas
```

**4. IoT Data Collection 🌡️**

```javascript
// Sensor readings - each sensor might send different data
{
  sensorId: "TEMP-001",
  timestamp: "2024-11-14T10:30:00Z",
  temperature: 25.5,
  humidity: 60,
  // Some sensors have extra fields
  pressure: 1013.25,
  location: { lat: 13.0827, lon: 80.2707 }
}
```

### Performance Comparison

| Operation | SQL | NoSQL (MongoDB) |
|-----------|-----|-----------------|
| **Simple Read** | Fast ⚡ | Very Fast ⚡⚡ |
| **Complex Query** | Very Fast ⚡⚡ | Slow 🐌 |
| **Write** | Fast ⚡ | Very Fast ⚡⚡ |
| **Joins** | Native ✅ | Manual ❌ |
| **Scaling** | Hard 😓 | Easy 😊 |

---

## 🍃 MongoDB Fundamentals {#mongodb-fundamentals}

### Core Concepts

```mermaid
graph LR
    A[MongoDB Instance] --> B[Database 1: myshop]
    A --> C[Database 2: myblog]
    
    B --> D[Collection: users]
    B --> E[Collection: products]
    B --> F[Collection: orders]
    
    D --> G[Document 1]
    D --> H[Document 2]
    D --> I[Document 3]
    
    G --> J[Fields: _id, name, email]
    
    style A fill:#4CAF50,color:#fff
    style B fill:#2196F3,color:#fff
    style D fill:#FF9800,color:#fff
    style G fill:#E91E63,color:#fff
```

### Terminology Translation

| SQL Term | MongoDB Term | Example |
|----------|--------------|---------|
| Database | Database | `myshop` |
| Table | Collection | `users` |
| Row | Document | `{ name: "John" }` |
| Column | Field | `name`, `email` |
| Index | Index | `{ email: 1 }` |
| JOIN | Lookup/$lookup | Reference or embed |

### Document Example with Explanation

```javascript
{
  // _id: Automatically generated unique identifier
  _id: ObjectId("507f1f77bcf86cd799439011"),
  
  // Regular fields (like SQL columns)
  username: "john_doe",
  email: "john@email.com",
  age: 28,
  
  // Embedded document (nested object)
  address: {
    street: "123 Main St",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    pincode: "600001"
  },
  
  // Array field (multiple values)
  interests: ["coding", "gaming", "reading"],
  
  // Array of embedded documents
  socialProfiles: [
    { platform: "Twitter", handle: "@johndoe" },
    { platform: "GitHub", handle: "johndoe" }
  ],
  
  // Date type
  createdAt: ISODate("2024-01-15T10:30:00Z"),
  lastLogin: ISODate("2024-11-14T08:15:00Z"),
  
  // Boolean
  isActive: true,
  
  // Null value
  middleName: null
}
```

### Two Relationship Strategies

#### 1. **Embedded Documents** (Data Together)

```javascript
// Good for one-to-few relationships
{
  _id: 1,
  username: "john_doe",
  email: "john@email.com",
  // Embed addresses directly
  addresses: [
    {
      type: "home",
      street: "123 Main St",
      city: "Chennai"
    },
    {
      type: "work",
      street: "456 Office Rd",
      city: "Mumbai"
    }
  ]
}
```

**Pros:** Fast reads (one query), atomic updates  
**Cons:** Document size limits (16MB), data duplication

#### 2. **Referenced Documents** (Data Separate)

```javascript
// Users collection
{
  _id: 1,
  username: "john_doe",
  email: "john@email.com"
}

// Orders collection (references user)
{
  _id: 101,
  userId: 1,  // Reference to user
  total: 129.99,
  items: [...]
}
```

**Pros:** No duplication, smaller documents  
**Cons:** Multiple queries needed (like JOIN)

---

## ☁️ MongoDB Atlas Setup {#mongodb-atlas}

### What is MongoDB Atlas?

MongoDB Atlas is the **cloud-hosted** version of MongoDB:

* No installation needed
* Free tier available (512MB)
* Automatic backups
* Global deployment
* Built-in security

### Setup Steps

#### Step 1: Create Account

```mermaid
graph LR
    A[Go to mongodb.com/atlas] --> B[Sign Up]
    B --> C[Verify Email]
    C --> D[Create Organization]
    D --> E[Create Project]
    
    style A fill:#4CAF50,color:#fff
    style E fill:#2196F3,color:#fff
```

1. Visit: <https://www.mongodb.com/cloud/atlas/register>
2. Sign up with email or Google
3. Verify your email address

#### Step 2: Create Free Cluster

1. Click **"Build a Database"**
2. Choose **"M0 FREE"** tier
3. Select **AWS** as provider
4. Choose region closest to you (e.g., Mumbai for India)
5. Name your cluster (e.g., `Cluster0`)
6. Click **"Create"**

```
⏱️ Cluster creation takes 3-5 minutes
```

#### Step 3: Setup Security

**Database Access:**

```
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Username: myappuser
4. Password: (generate secure password) 
   Example: xK9p2Lm#vR8q
5. User Privileges: "Read and write to any database"
6. Click "Add User"
```

**Network Access:**

```
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
   ⚠️ Note: For production, use specific IP addresses
4. Click "Confirm"
```

#### Step 4: Get Connection String

```
1. Go to "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Driver: Node.js, Version: 5.5 or later
5. Copy the connection string:
```

```
mongodb+srv://myappuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**Replace `<password>` with your actual password!**

### Connection String Breakdown

```
mongodb+srv://   [username]  :  [password]  @  [cluster-url]  / [database]  ?  [options]
     ↓               ↓             ↓              ↓               ↓             ↓
  Protocol      myappuser    xK9p2Lm#vR8q  cluster0.xxxxx  myshopdb   retryWrites=true
```

---

## 📝 SQL Query Basics {#sql-queries}

### The Four Essential Operations (CRUD)

```mermaid
graph LR
    A[CRUD Operations] --> B[CREATE - INSERT]
    A --> C[READ - SELECT]
    A --> D[UPDATE - UPDATE]
    A --> E[DELETE - DELETE]
    
    style A fill:#FF9800,color:#fff
    style B fill:#4CAF50,color:#fff
    style C fill:#2196F3,color:#fff
    style D fill:#FFC107,color:#000
    style E fill:#F44336,color:#fff
```

### 1. SELECT - Reading Data

**Basic SELECT:**

```sql
-- Get all users
SELECT * FROM users;

-- Get specific columns
SELECT name, email FROM users;

-- Get with condition
SELECT * FROM users WHERE age > 25;

-- Get with multiple conditions
SELECT * FROM users 
WHERE age > 25 AND city = 'Chennai';

-- Sort results
SELECT * FROM users ORDER BY name ASC;

-- Limit results
SELECT * FROM users LIMIT 10;
```

**Aggregate Functions:**

```sql
-- Count users
SELECT COUNT(*) FROM users;

-- Average age
SELECT AVG(age) FROM users;

-- Group by city
SELECT city, COUNT(*) as user_count 
FROM users 
GROUP BY city;

-- Find max price
SELECT MAX(price) FROM products;
```

### 2. INSERT - Creating Data

```sql
-- Insert single row
INSERT INTO users (name, email, age, city) 
VALUES ('John Doe', 'john@email.com', 28, 'Chennai');

-- Insert multiple rows
INSERT INTO users (name, email, age, city) 
VALUES 
  ('Jane Smith', 'jane@email.com', 32, 'Mumbai'),
  ('Bob Johnson', 'bob@email.com', 25, 'Delhi');

-- Insert with auto-increment ID
INSERT INTO products (name, price, stock) 
VALUES ('Wireless Mouse', 29.99, 150);
-- ID is generated automatically
```

### 3. UPDATE - Modifying Data

```sql
-- Update single record
UPDATE users 
SET age = 29 
WHERE id = 1;

-- Update multiple fields
UPDATE users 
SET age = 29, city = 'Bangalore' 
WHERE id = 1;

-- Update multiple records
UPDATE products 
SET price = price * 1.1 
WHERE category = 'Electronics';

-- ⚠️ Be careful! Without WHERE, updates ALL rows
UPDATE users SET age = 30;  -- Updates everyone!
```

### 4. DELETE - Removing Data

```sql
-- Delete specific record
DELETE FROM users WHERE id = 1;

-- Delete with condition
DELETE FROM products WHERE stock = 0;

-- ⚠️ Be VERY careful! Without WHERE, deletes ALL rows
DELETE FROM users;  -- Deletes everyone!

-- Safer approach: Use SELECT first to verify
SELECT * FROM users WHERE id = 1;  -- Check what you'll delete
DELETE FROM users WHERE id = 1;    -- Then delete
```

### Joins - Combining Tables

```sql
-- INNER JOIN - Get orders with customer names
SELECT orders.id, customers.name, orders.total 
FROM orders 
INNER JOIN customers ON orders.customer_id = customers.id;

-- LEFT JOIN - Get all customers and their orders (even if no orders)
SELECT customers.name, orders.id, orders.total 
FROM customers 
LEFT JOIN orders ON customers.id = orders.customer_id;

-- Multiple JOINs
SELECT 
  customers.name,
  orders.id as order_id,
  products.name as product_name,
  order_items.quantity
FROM customers
INNER JOIN orders ON customers.id = orders.customer_id
INNER JOIN order_items ON orders.id = order_items.order_id
INNER JOIN products ON order_items.product_id = products.id;
```

### Visual Join Example

```
Customers Table:
+----+----------+
| id | name     |
+----+----------+
| 1  | John     |
| 2  | Jane     |
| 3  | Bob      |
+----+----------+

Orders Table:
+----+-------------+--------+
| id | customer_id | total  |
+----+-------------+--------+
| 1  | 1           | 129.99 |
| 2  | 1           | 49.99  |
| 3  | 2           | 89.99  |
+----+-------------+--------+

INNER JOIN Result:
+----------+----------+--------+
| name     | order_id | total  |
+----------+----------+--------+
| John     | 1        | 129.99 |
| John     | 2        | 49.99  |
| Jane     | 3        | 89.99  |
+----------+----------+--------+
(Bob has no orders, so he's not included)

LEFT JOIN Result:
+----------+----------+--------+
| name     | order_id | total  |
+----------+----------+--------+
| John     | 1        | 129.99 |
| John     | 2        | 49.99  |
| Jane     | 3        | 89.99  |
| Bob      | NULL     | NULL   |
+----------+----------+--------+
(Bob is included even without orders)
```

---

## 🍃 MongoDB Operations {#mongodb-operations}

### Using MongoDB with Node.js

**Install the driver:**

```bash
npm install mongodb
```

**Connect to MongoDB:**

```javascript
const { MongoClient } = require('mongodb');

// Connection URL (from Atlas)
const url = 'mongodb+srv://myappuser:xK9p2Lm#vR8q@cluster0.xxxxx.mongodb.net/';
const dbName = 'myshopdb';

// Create client
const client = new MongoClient(url);

async function main() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB!');
    
    // Get database
    const db = client.db(dbName);
    
    // Get collection
    const usersCollection = db.collection('users');
    
    // Your operations here...
    
  } finally {
    // Close connection
    await client.close();
  }
}

main();
```

### CRUD Operations in MongoDB

#### 1. CREATE - Insert Documents

```javascript
// Insert one document
const newUser = {
  name: 'John Doe',
  email: 'john@email.com',
  age: 28,
  city: 'Chennai',
  createdAt: new Date()
};

const result = await usersCollection.insertOne(newUser);
console.log('Inserted ID:', result.insertedId);

// Insert many documents
const newUsers = [
  { name: 'Jane Smith', email: 'jane@email.com', age: 32 },
  { name: 'Bob Johnson', email: 'bob@email.com', age: 25 }
];

const multiResult = await usersCollection.insertMany(newUsers);
console.log('Inserted count:', multiResult.insertedCount);
```

#### 2. READ - Find Documents

```javascript
// Find all documents
const allUsers = await usersCollection.find({}).toArray();

// Find with filter
const chennaiUsers = await usersCollection
  .find({ city: 'Chennai' })
  .toArray();

// Find one document
const user = await usersCollection.findOne({ email: 'john@email.com' });

// Find with comparison operators
const youngUsers = await usersCollection
  .find({ age: { $lt: 30 } })  // Less than 30
  .toArray();

const adultUsers = await usersCollection
  .find({ age: { $gte: 18 } })  // Greater than or equal to 18
  .toArray();

// Find with multiple conditions
const filteredUsers = await usersCollection
  .find({ 
    age: { $gte: 25, $lte: 35 },  // Between 25 and 35
    city: 'Chennai' 
  })
  .toArray();

// Find with OR condition
const multiCityUsers = await usersCollection
  .find({ 
    $or: [
      { city: 'Chennai' },
      { city: 'Mumbai' }
    ]
  })
  .toArray();

// Sorting
const sortedUsers = await usersCollection
  .find({})
  .sort({ age: 1 })  // 1 = ascending, -1 = descending
  .toArray();

// Limit results
const recentUsers = await usersCollection
  .find({})
  .sort({ createdAt: -1 })
  .limit(10)
  .toArray();

// Select specific fields (projection)
const userEmails = await usersCollection
  .find({}, { projection: { name: 1, email: 1, _id: 0 } })
  .toArray();
```

#### 3. UPDATE - Modify Documents

```javascript
// Update one document
await usersCollection.updateOne(
  { email: 'john@email.com' },  // Filter
  { $set: { age: 29 } }         // Update
);

// Update multiple documents
await usersCollection.updateMany(
  { city: 'Chennai' },
  { $set: { country: 'India' } }
);

// Increment value
await usersCollection.updateOne(
  { email: 'john@email.com' },
  { $inc: { age: 1 } }  // Increment age by 1
);

// Add to array
await usersCollection.updateOne(
  { email: 'john@email.com' },
  { $push: { interests: 'photography' } }
);

// Remove from array
await usersCollection.updateOne(
  { email: 'john@email.com' },
  { $pull: { interests: 'gaming' } }
);

// Replace entire document (except _id)
await usersCollection.replaceOne(
  { email: 'john@email.com' },
  { 
    name: 'John Doe Updated',
    email: 'john@email.com',
    age: 29,
    city: 'Bangalore'
  }
);
```

#### 4. DELETE - Remove Documents

```javascript
// Delete one document
await usersCollection.deleteOne({ email: 'john@email.com' });

// Delete many documents
await usersCollection.deleteMany({ age: { $lt: 18 } });

// Delete all documents in collection (be careful!)
await usersCollection.deleteMany({});
```

### MongoDB Query Operators Reference

```javascript
// Comparison Operators
{ age: { $eq: 25 } }      // Equal to
{ age: { $ne: 25 } }      // Not equal to
{ age: { $gt: 25 } }      // Greater than
{ age: { $gte: 25 } }     // Greater than or equal
{ age: { $lt: 30 } }      // Less than
{ age: { $lte: 30 } }     // Less than or equal
{ city: { $in: ['Chennai', 'Mumbai'] } }  // In array
{ city: { $nin: ['Delhi'] } }  // Not in array

// Logical Operators
{ $and: [{ age: { $gte: 25 } }, { city: 'Chennai' }] }
{ $or: [{ city: 'Chennai' }, { city: 'Mumbai' }] }
{ $nor: [{ age: { $lt: 18 } }, { age: { $gt: 65 } }] }
{ age: { $not: { $lt: 25 } } }

// Element Operators
{ email: { $exists: true } }   // Field exists
{ middleName: { $type: 'string' } }  // Field type check

// Array Operators
{ interests: 'coding' }  // Array contains value
{ interests: { $all: ['coding', 'gaming'] } }  // Contains all values
{ interests: { $size: 3 } }  // Array has exact size
```

---

## 🔄 SQL vs MongoDB: Side-by-Side Comparison {#comparison}

### Same Operations, Different Syntax

#### Create/Insert

**SQL:**

```sql
INSERT INTO users (name, email, age, city) 
VALUES ('John Doe', 'john@email.com', 28, 'Chennai');
```

**MongoDB:**

```javascript
await db.collection('users').insertOne({
  name: 'John Doe',
  email: 'john@email.com',
  age: 28,
  city: 'Chennai'
});
```

#### Read/Select

**SQL:**

```sql
SELECT * FROM users WHERE age > 25 ORDER BY name LIMIT 10;
```

**MongoDB:**

```javascript
await db.collection('users')
  .find({ age: { $gt: 25 } })
  .sort({ name: 1 })
  .limit(10)
  .toArray();
```

#### Update

**SQL:**

```sql
UPDATE users SET age = 29 WHERE email = 'john@email.com';
```

**MongoDB:**

```javascript
await db.collection('users').updateOne(
  { email: 'john@email.com' },
  { $set: { age: 29 } }
);
```

#### Delete

**SQL:**

```sql
DELETE FROM users WHERE age < 18;
```

**MongoDB:**

```javascript
await db.collection('users').deleteMany({ age: { $lt: 18 } });
```

### Handling Relationships

#### SQL Approach: Separate Tables with JOINs

```sql
-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100)
);

-- Orders table
CREATE TABLE orders (
  id INT PRIMARY KEY,
  user_id INT,
  total DECIMAL(10,2),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Query with JOIN
SELECT users.name, orders.total 
FROM users 
INNER JOIN orders ON users.id = orders.user_id;
```

#### MongoDB Approach 1: Embedded Documents

```javascript
// Single document with embedded orders
{
  _id: 1,
  name: 'John Doe',
  email: 'john@email.com',
  orders: [
    { orderId: 101, total: 129.99, date: '2024-11-01' },
    { orderId: 102, total: 49.99, date: '2024-11-10' }
  ]
}

// Query - no join needed!
const user = await db.collection('users').findOne({ _id: 1 });
console.log(user.orders);  // All orders right there
```

#### MongoDB Approach 2: Referenced Documents + $lookup

```javascript
// Users collection
{ _id: 1, name: 'John Doe', email: 'john@email.com' }

// Orders collection
{ _id: 101, userId: 1, total: 129.99 }
{ _id: 102, userId: 1, total: 49.99 }

// Query with $lookup (like JOIN)
const result = await db.collection('users').aggregate([
  {
    $lookup: {
      from: 'orders',
      localField: '_id',
      foreignField: 'userId',
      as: 'orders'
    }
  }
]).toArray();

// Result:
[
  {
    _id: 1,
    name: 'John Doe',
    email: 'john@email.com',
    orders: [
      { _id: 101, userId: 1, total: 129.99 },
      { _id: 102, userId: 1, total: 49.99 }
    ]
  }
]
```

---

## 🎯 Hands-On Practice {#practice}

### Exercise 1: Setup MongoDB Atlas ✅

**Task:** Create your MongoDB Atlas account and connect to it.

**Steps:**

1. Sign up at mongodb.com/atlas
2. Create a free M0 cluster
3. Setup database user and network access
4. Get connection string
5. Test connection with this code:

```javascript
const { MongoClient } = require('mongodb');

const url = 'YOUR_CONNECTION_STRING_HERE';
const client = new MongoClient(url);

async function testConnection() {
  try {
    await client.connect();
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    const db = client.db('test');
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections);
    
  } catch (error) {
    console.error('❌ Connection failed:', error);
  } finally {
    await client.close();
  }
}

testConnection();
```

---

### Exercise 2: Build a Simple Blog System 📝

**Scenario:** Create a blog with users, posts, and comments.

#### Part A: Design the Schema

**SQL Approach (3 tables):**

```sql
-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50),
  email VARCHAR(100),
  created_at TIMESTAMP
);

-- Posts table
CREATE TABLE posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  title VARCHAR(200),
  content TEXT,
  created_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Comments table
CREATE TABLE comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  post_id INT,
  user_id INT,
  text TEXT,
  created_at TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

**MongoDB Approach (Embedded):**

```javascript
// Single document with everything embedded
{
  _id: ObjectId("..."),
  username: "john_doe",
  email: "john@email.com",
  created_at: ISODate("2024-01-15"),
  posts: [
    {
      postId: 1,
      title: "My First Post",
      content: "This is my first blog post!",
      created_at: ISODate("2024-11-01"),
      comments: [
        {
          username: "jane_smith",
          text: "Great post!",
          created_at: ISODate("2024-11-02")
        },
        {
          username: "bob_jones",
          text: "Thanks for sharing!",
          created_at: ISODate("2024-11-03")
        }
      ],
      likes: 15
    }
  ]
}
```

#### Part B: Implement CRUD Operations

**Task 1: Create a User**

```javascript
const { MongoClient } = require('mongodb');

async function createUser(username, email) {
  const client = new MongoClient('YOUR_CONNECTION_STRING');
  
  try {
    await client.connect();
    const db = client.db('blogdb');
    const users = db.collection('users');
    
    const newUser = {
      username: username,
      email: email,
      created_at: new Date(),
      posts: []
    };
    
    const result = await users.insertOne(newUser);
    console.log('User created with ID:', result.insertedId);
    
    return result.insertedId;
    
  } finally {
    await client.close();
  }
}

// Test it
createUser('john_doe', 'john@email.com');
```

**Task 2: Create a Post**

```javascript
async function createPost(username, title, content) {
  const client = new MongoClient('YOUR_CONNECTION_STRING');
  
  try {
    await client.connect();
    const db = client.db('blogdb');
    const users = db.collection('users');
    
    const newPost = {
      postId: Date.now(),  // Simple ID generation
      title: title,
      content: content,
      created_at: new Date(),
      comments: [],
      likes: 0
    };
    
    // Add post to user's posts array
    await users.updateOne(
      { username: username },
      { $push: { posts: newPost } }
    );
    
    console.log('Post created successfully!');
    
  } finally {
    await client.close();
  }
}

// Test it
createPost('john_doe', 'My First Post', 'This is the content of my post!');
```

**Task 3: Add a Comment**

```javascript
async function addComment(username, postId, commentText, commenterName) {
  const client = new MongoClient('YOUR_CONNECTION_STRING');
  
  try {
    await client.connect();
    const db = client.db('blogdb');
    const users = db.collection('users');
    
    const newComment = {
      username: commenterName,
      text: commentText,
      created_at: new Date()
    };
    
    // Add comment to specific post
    await users.updateOne(
      { 
        username: username,
        'posts.postId': postId 
      },
      { 
        $push: { 'posts.$.comments': newComment } 
      }
    );
    
    console.log('Comment added successfully!');
    
  } finally {
    await client.close();
  }
}

// Test it
addComment('john_doe', 1699999999999, 'Great post!', 'jane_smith');
```

**Task 4: Get All Posts by a User**

```javascript
async function getUserPosts(username) {
  const client = new MongoClient('YOUR_CONNECTION_STRING');
  
  try {
    await client.connect();
    const db = client.db('blogdb');
    const users = db.collection('users');
    
    const user = await users.findOne(
      { username: username },
      { projection: { posts: 1, _id: 0 } }
    );
    
    if (user && user.posts) {
      console.log(`Posts by ${username}:`);
      user.posts.forEach(post => {
        console.log(`\n📝 ${post.title}`);
        console.log(`   Content: ${post.content}`);
        console.log(`   Comments: ${post.comments.length}`);
        console.log(`   Likes: ${post.likes}`);
      });
    }
    
    return user?.posts || [];
    
  } finally {
    await client.close();
  }
}

// Test it
getUserPosts('john_doe');
```

---

### Exercise 3: E-Commerce Product Catalog 🛒

**Scenario:** Build a product catalog with categories and reviews.

#### Step 1: Create Products

```javascript
async function addProduct(productData) {
  const client = new MongoClient('YOUR_CONNECTION_STRING');
  
  try {
    await client.connect();
    const db = client.db('shopdb');
    const products = db.collection('products');
    
    const product = {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      category: productData.category,
      stock: productData.stock,
      images: productData.images || [],
      specs: productData.specs || {},
      reviews: [],
      rating: 0,
      created_at: new Date()
    };
    
    const result = await products.insertOne(product);
    console.log('Product added:', result.insertedId);
    
  } finally {
    await client.close();
  }
}

// Add sample products
addProduct({
  name: 'Wireless Mouse',
  description: 'Ergonomic wireless mouse with 3 buttons',
  price: 29.99,
  category: 'Electronics',
  stock: 150,
  images: ['mouse1.jpg', 'mouse2.jpg'],
  specs: {
    connectivity: 'Bluetooth 5.0',
    battery: '2 AA batteries',
    color: 'Black'
  }
});

addProduct({
  name: 'USB-C Cable',
  description: 'Fast charging USB-C cable, 2 meters',
  price: 19.99,
  category: 'Accessories',
  stock: 300,
  specs: {
    length: '2m',
    speed: '100W fast charging'
  }
});
```

#### Step 2: Search Products

```javascript
async function searchProducts(query) {
  const client = new MongoClient('YOUR_CONNECTION_STRING');
  
  try {
    await client.connect();
    const db = client.db('shopdb');
    const products = db.collection('products');
    
    // Search by name or category
    const results = await products.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },  // Case-insensitive
        { category: { $regex: query, $options: 'i' } }
      ]
    }).toArray();
    
    console.log(`Found ${results.length} products:`);
    results.forEach(p => {
      console.log(`- ${p.name} (${p.price}) - ${p.stock} in stock`);
    });
    
    return results;
    
  } finally {
    await client.close();
  }
}

// Test search
searchProducts('mouse');
searchProducts('USB');
```

#### Step 3: Add Product Reviews

```javascript
async function addReview(productId, reviewData) {
  const client = new MongoClient('YOUR_CONNECTION_STRING');
  
  try {
    await client.connect();
    const db = client.db('shopdb');
    const products = db.collection('products');
    
    const review = {
      username: reviewData.username,
      rating: reviewData.rating,  // 1-5 stars
      comment: reviewData.comment,
      created_at: new Date()
    };
    
    // Add review
    await products.updateOne(
      { _id: productId },
      { $push: { reviews: review } }
    );
    
    // Recalculate average rating
    const product = await products.findOne({ _id: productId });
    const avgRating = product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;
    
    await products.updateOne(
      { _id: productId },
      { $set: { rating: Math.round(avgRating * 10) / 10 } }  // Round to 1 decimal
    );
    
    console.log('Review added! New average rating:', avgRating);
    
  } finally {
    await client.close();
  }
}
```

#### Step 4: Get Products by Category with Filters

```javascript
async function getProductsByCategory(category, filters = {}) {
  const client = new MongoClient('YOUR_CONNECTION_STRING');
  
  try {
    await client.connect();
    const db = client.db('shopdb');
    const products = db.collection('products');
    
    // Build query
    const query = { category: category };
    
    // Add price range filter
    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) query.price.$gte = filters.minPrice;
      if (filters.maxPrice) query.price.$lte = filters.maxPrice;
    }
    
    // Add rating filter
    if (filters.minRating) {
      query.rating = { $gte: filters.minRating };
    }
    
    // Add stock filter
    if (filters.inStockOnly) {
      query.stock = { $gt: 0 };
    }
    
    // Execute query
    let cursor = products.find(query);
    
    // Sort
    if (filters.sortBy) {
      const sortOrder = filters.sortOrder === 'desc' ? -1 : 1;
      cursor = cursor.sort({ [filters.sortBy]: sortOrder });
    }
    
    // Limit
    if (filters.limit) {
      cursor = cursor.limit(filters.limit);
    }
    
    const results = await cursor.toArray();
    
    console.log(`Found ${results.length} products in ${category}:`);
    results.forEach(p => {
      console.log(`- ${p.name} (${p.price}) ⭐${p.rating} [${p.stock} in stock]`);
    });
    
    return results;
    
  } finally {
    await client.close();
  }
}

// Test with filters
getProductsByCategory('Electronics', {
  minPrice: 20,
  maxPrice: 50,
  inStockOnly: true,
  sortBy: 'price',
  sortOrder: 'asc',
  limit: 10
});
```

---

## 🎓 Key Takeaways

### When to Use SQL ✅

1. **Complex relationships** between data
2. **ACID compliance** required (banking, finance)
3. **Structured data** with predefined schema
4. **Complex queries** and reporting
5. **Data integrity** is critical

### When to Use NoSQL (MongoDB) ✅

1. **Flexible schema** needed
2. **Rapid development** cycles
3. **Hierarchical data** (nested structures)
4. **Horizontal scaling** required
5. **Developer-friendly** JSON-like format

### Best Practices

#### For SQL

* ✅ Always use `WHERE` clause with `UPDATE` and `DELETE`
* ✅ Create indexes on frequently queried columns
* ✅ Use transactions for multi-step operations
* ✅ Normalize data to avoid duplication
* ✅ Use prepared statements to prevent SQL injection

#### For MongoDB

* ✅ Design schema based on access patterns
* ✅ Embed data that's accessed together
* ✅ Reference data that's large or updated independently
* ✅ Create indexes on frequently queried fields
* ✅ Use projection to limit returned fields
* ✅ Validate connection strings (hide passwords!)
* ✅ Handle connection errors gracefully

---

## 📚 Additional Resources

### Official Documentation

* **MongoDB Manual:** <https://docs.mongodb.com/>
* **MongoDB University:** <https://university.mongodb.com/> (Free courses!)
* **SQL Tutorial:** <https://www.w3schools.com/sql/>
* **PostgreSQL Docs:** <https://www.postgresql.org/docs/>

### Practice Platforms

* **MongoDB Atlas:** Free 512MB cluster
* **SQLite Browser:** Practice SQL locally
* **LeetCode Database:** SQL practice problems
* **HackerRank SQL:** SQL challenges

### Next Steps

1. ✅ Complete MongoDB Atlas setup
2. ✅ Practice CRUD operations
3. ✅ Build a small project (blog or todo app)
4. ✅ Learn about indexing and performance
5. ✅ Explore aggregation pipelines
6. ✅ Study data modeling patterns

---

## 🎯 Quick Reference Cheat Sheet

### MongoDB Commands

```javascript
// Connect
const client = new MongoClient(url);
await client.connect();
const db = client.db('dbname');
const collection = db.collection('collname');

// Create
await collection.insertOne({ name: 'John' });
await collection.insertMany([{...}, {...}]);

// Read
await collection.find({}).toArray();
await collection.findOne({ _id: 1 });
await collection.find({ age: { $gt: 25 } }).toArray();

// Update
await collection.updateOne({ _id: 1 }, { $set: { age: 30 } });
await collection.updateMany({ city: 'Chennai' }, { $set: { country: 'India' } });

// Delete
await collection.deleteOne({ _id: 1 });
await collection.deleteMany({ age: { $lt: 18 } });

// Close
await client.close();
```

### SQL Commands

```sql
-- Create
INSERT INTO users (name, email) VALUES ('John', 'john@email.com');

-- Read
SELECT * FROM users WHERE age > 25;
SELECT name, email FROM users ORDER BY name LIMIT 10;

-- Update
UPDATE users SET age = 30 WHERE id = 1;

-- Delete
DELETE FROM users WHERE id = 1;

-- Join
SELECT * FROM orders 
INNER JOIN users ON orders.user_id = users.id;
```

---

## 🏁 Session Complete

Congratulations! You now understand:

* ✅ The difference between SQL and NoSQL databases
* ✅ When to use each type
* ✅ How to set up MongoDB Atlas
* ✅ CRUD operations in both SQL and MongoDB
* ✅ Relationships and data modeling strategies

**Next Session Preview:** We'll integrate MongoDB into our Express.js API and build a full-stack application with persistent data storage!

---

*Happy Coding! 🚀*
