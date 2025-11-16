# SQL vs NoSQL - Side-by-Side Comparison 🔄

## Complete Query Comparison Guide

This document shows how to perform the same operations in both SQL and MongoDB.

---

## 📊 Table of Contents

1. [Create Operations](#create-operations)
2. [Read Operations](#read-operations)
3. [Update Operations](#update-operations)
4. [Delete Operations](#delete-operations)
5. [Filtering & Conditions](#filtering--conditions)
6. [Sorting & Limiting](#sorting--limiting)
7. [Aggregations](#aggregations)
8. [Relationships](#relationships)

---

## 1. CREATE OPERATIONS {#create-operations}

### Insert Single Record

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

### Insert Multiple Records

**SQL:**

```sql
INSERT INTO users (name, email, age, city) 
VALUES 
  ('Jane Smith', 'jane@email.com', 32, 'Mumbai'),
  ('Bob Johnson', 'bob@email.com', 25, 'Delhi');
```

**MongoDB:**

```javascript
await db.collection('users').insertMany([
  { name: 'Jane Smith', email: 'jane@email.com', age: 32, city: 'Mumbai' },
  { name: 'Bob Johnson', email: 'bob@email.com', age: 25, city: 'Delhi' }
]);
```

---

## 2. READ OPERATIONS {#read-operations}

### Get All Records

**SQL:**

```sql
SELECT * FROM users;
```

**MongoDB:**

```javascript
await db.collection('users').find({}).toArray();
```

### Get Specific Fields

**SQL:**

```sql
SELECT name, email FROM users;
```

**MongoDB:**

```javascript
await db.collection('users').find({}, { 
  projection: { name: 1, email: 1, _id: 0 } 
}).toArray();
```

### Get Single Record

**SQL:**

```sql
SELECT * FROM users WHERE email = 'john@email.com' LIMIT 1;
```

**MongoDB:**

```javascript
await db.collection('users').findOne({ 
  email: 'john@email.com' 
});
```

---

## 3. UPDATE OPERATIONS {#update-operations}

### Update Single Record

**SQL:**

```sql
UPDATE users 
SET age = 29 
WHERE email = 'john@email.com';
```

**MongoDB:**

```javascript
await db.collection('users').updateOne(
  { email: 'john@email.com' },
  { $set: { age: 29 } }
);
```

### Update Multiple Records

**SQL:**

```sql
UPDATE users 
SET country = 'India' 
WHERE city IN ('Chennai', 'Mumbai', 'Delhi');
```

**MongoDB:**

```javascript
await db.collection('users').updateMany(
  { city: { $in: ['Chennai', 'Mumbai', 'Delhi'] } },
  { $set: { country: 'India' } }
);
```

### Increment Value

**SQL:**

```sql
UPDATE users 
SET age = age + 1 
WHERE email = 'john@email.com';
```

**MongoDB:**

```javascript
await db.collection('users').updateOne(
  { email: 'john@email.com' },
  { $inc: { age: 1 } }
);
```

---

## 4. DELETE OPERATIONS {#delete-operations}

### Delete Single Record

**SQL:**

```sql
DELETE FROM users WHERE id = 1;
```

**MongoDB:**

```javascript
await db.collection('users').deleteOne({ 
  _id: ObjectId('...') 
});
```

### Delete Multiple Records

**SQL:**

```sql
DELETE FROM users WHERE age < 18;
```

**MongoDB:**

```javascript
await db.collection('users').deleteMany({ 
  age: { $lt: 18 } 
});
```

### Delete All Records

**SQL:**

```sql
DELETE FROM users;
-- or
TRUNCATE TABLE users;
```

**MongoDB:**

```javascript
await db.collection('users').deleteMany({});
```

---

## 5. FILTERING & CONDITIONS {#filtering--conditions}

### Equal To

**SQL:**

```sql
SELECT * FROM users WHERE city = 'Chennai';
```

**MongoDB:**

```javascript
await db.collection('users').find({ 
  city: 'Chennai' 
}).toArray();
```

### Not Equal To

**SQL:**

```sql
SELECT * FROM users WHERE city != 'Mumbai';
-- or
SELECT * FROM users WHERE city <> 'Mumbai';
```

**MongoDB:**

```javascript
await db.collection('users').find({ 
  city: { $ne: 'Mumbai' } 
}).toArray();
```

### Greater Than / Less Than

**SQL:**

```sql
SELECT * FROM users WHERE age > 30;
SELECT * FROM users WHERE age >= 30;
SELECT * FROM users WHERE age < 25;
SELECT * FROM users WHERE age <= 25;
```

**MongoDB:**

```javascript
await db.collection('users').find({ age: { $gt: 30 } }).toArray();
await db.collection('users').find({ age: { $gte: 30 } }).toArray();
await db.collection('users').find({ age: { $lt: 25 } }).toArray();
await db.collection('users').find({ age: { $lte: 25 } }).toArray();
```

### IN / NOT IN

**SQL:**

```sql
SELECT * FROM users WHERE city IN ('Chennai', 'Mumbai', 'Delhi');
SELECT * FROM users WHERE city NOT IN ('Chennai', 'Mumbai');
```

**MongoDB:**

```javascript
await db.collection('users').find({ 
  city: { $in: ['Chennai', 'Mumbai', 'Delhi'] } 
}).toArray();

await db.collection('users').find({ 
  city: { $nin: ['Chennai', 'Mumbai'] } 
}).toArray();
```

### BETWEEN

**SQL:**

```sql
SELECT * FROM users WHERE age BETWEEN 25 AND 35;
```

**MongoDB:**

```javascript
await db.collection('users').find({ 
  age: { $gte: 25, $lte: 35 } 
}).toArray();
```

### AND Condition

**SQL:**

```sql
SELECT * FROM users WHERE city = 'Chennai' AND age > 25;
```

**MongoDB:**

```javascript
await db.collection('users').find({ 
  city: 'Chennai',
  age: { $gt: 25 } 
}).toArray();

// Or explicit $and
await db.collection('users').find({ 
  $and: [
    { city: 'Chennai' },
    { age: { $gt: 25 } }
  ]
}).toArray();
```

### OR Condition

**SQL:**

```sql
SELECT * FROM users WHERE city = 'Chennai' OR age > 30;
```

**MongoDB:**

```javascript
await db.collection('users').find({ 
  $or: [
    { city: 'Chennai' },
    { age: { $gt: 30 } }
  ]
}).toArray();
```

### LIKE (Pattern Matching)

**SQL:**

```sql
SELECT * FROM users WHERE name LIKE 'J%';        -- Starts with J
SELECT * FROM users WHERE name LIKE '%son';      -- Ends with son
SELECT * FROM users WHERE name LIKE '%oh%';      -- Contains oh
```

**MongoDB:**

```javascript
// Starts with J
await db.collection('users').find({ 
  name: /^J/ 
}).toArray();

// Ends with son
await db.collection('users').find({ 
  name: /son$/ 
}).toArray();

// Contains oh (case-insensitive)
await db.collection('users').find({ 
  name: /oh/i 
}).toArray();
```

### NULL Checks

**SQL:**

```sql
SELECT * FROM users WHERE middle_name IS NULL;
SELECT * FROM users WHERE middle_name IS NOT NULL;
```

**MongoDB:**

```javascript
await db.collection('users').find({ 
  middleName: null 
}).toArray();

await db.collection('users').find({ 
  middleName: { $ne: null } 
}).toArray();

// Or check if field exists
await db.collection('users').find({ 
  middleName: { $exists: false } 
}).toArray();
```

---

## 6. SORTING & LIMITING {#sorting--limiting}

### Sorting

**SQL:**

```sql
SELECT * FROM users ORDER BY age ASC;
SELECT * FROM users ORDER BY age DESC;
SELECT * FROM users ORDER BY city ASC, age DESC;
```

**MongoDB:**

```javascript
await db.collection('users').find({}).sort({ age: 1 }).toArray();  // ASC
await db.collection('users').find({}).sort({ age: -1 }).toArray(); // DESC
await db.collection('users').find({}).sort({ city: 1, age: -1 }).toArray();
```

### Limiting Results

**SQL:**

```sql
SELECT * FROM users LIMIT 10;
```

**MongoDB:**

```javascript
await db.collection('users').find({}).limit(10).toArray();
```

### Pagination (Skip & Limit)

**SQL:**

```sql
SELECT * FROM users LIMIT 10 OFFSET 20;  -- Skip 20, get 10
```

**MongoDB:**

```javascript
await db.collection('users').find({}).skip(20).limit(10).toArray();
```

### Distinct Values

**SQL:**

```sql
SELECT DISTINCT city FROM users;
```

**MongoDB:**

```javascript
await db.collection('users').distinct('city');
```

---

## 7. AGGREGATIONS {#aggregations}

### Count

**SQL:**

```sql
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM users WHERE active = true;
```

**MongoDB:**

```javascript
await db.collection('users').countDocuments();
await db.collection('users').countDocuments({ active: true });
```

### Sum

**SQL:**

```sql
SELECT SUM(salary) FROM users;
```

**MongoDB:**

```javascript
await db.collection('users').aggregate([
  { $group: { _id: null, total: { $sum: '$salary' } } }
]).toArray();
```

### Average

**SQL:**

```sql
SELECT AVG(age) FROM users;
```

**MongoDB:**

```javascript
await db.collection('users').aggregate([
  { $group: { _id: null, avgAge: { $avg: '$age' } } }
]).toArray();
```

### Min / Max

**SQL:**

```sql
SELECT MIN(age), MAX(age) FROM users;
```

**MongoDB:**

```javascript
await db.collection('users').aggregate([
  { 
    $group: { 
      _id: null,
      minAge: { $min: '$age' },
      maxAge: { $max: '$age' }
    } 
  }
]).toArray();
```

### Group By

**SQL:**

```sql
SELECT city, COUNT(*) as user_count 
FROM users 
GROUP BY city;
```

**MongoDB:**

```javascript
await db.collection('users').aggregate([
  { 
    $group: { 
      _id: '$city',
      userCount: { $sum: 1 }
    } 
  }
]).toArray();
```

### Group By with Having

**SQL:**

```sql
SELECT city, AVG(salary) as avg_salary 
FROM users 
GROUP BY city
HAVING AVG(salary) > 60000;
```

**MongoDB:**

```javascript
await db.collection('users').aggregate([
  { 
    $group: { 
      _id: '$city',
      avgSalary: { $avg: '$salary' }
    } 
  },
  { $match: { avgSalary: { $gt: 60000 } } }
]).toArray();
```

---

## 8. RELATIONSHIPS {#relationships}

### One-to-Many (JOIN)

**SQL:**

```sql
SELECT 
  users.name,
  orders.id as order_id,
  orders.total
FROM users
INNER JOIN orders ON users.id = orders.user_id;
```

**MongoDB (Referenced):**

```javascript
// Option 1: Manual lookup (2 queries)
const users = await db.collection('users').find({}).toArray();
for (const user of users) {
  user.orders = await db.collection('orders').find({ 
    userId: user._id 
  }).toArray();
}

// Option 2: Aggregation with $lookup
await db.collection('users').aggregate([
  {
    $lookup: {
      from: 'orders',
      localField: '_id',
      foreignField: 'userId',
      as: 'orders'
    }
  }
]).toArray();
```

**MongoDB (Embedded):**

```javascript
// Data structure with embedded orders
{
  _id: ObjectId('...'),
  name: 'John Doe',
  email: 'john@email.com',
  orders: [
    { id: 1, total: 100, status: 'completed' },
    { id: 2, total: 200, status: 'shipped' }
  ]
}

// Query is simple
await db.collection('users').find({}).toArray();
```

### LEFT JOIN (All from left table)

**SQL:**

```sql
SELECT 
  users.name,
  orders.id as order_id
FROM users
LEFT JOIN orders ON users.id = orders.user_id;
```

**MongoDB:**

```javascript
await db.collection('users').aggregate([
  {
    $lookup: {
      from: 'orders',
      localField: '_id',
      foreignField: 'userId',
      as: 'orders'
    }
  }
]).toArray();
// Users without orders will have empty orders array
```

---

## 🎯 Key Differences Summary

| Operation | SQL | MongoDB |
|-----------|-----|---------|
| **Create** | INSERT INTO | insertOne() / insertMany() |
| **Read** | SELECT | find() / findOne() |
| **Update** | UPDATE SET | updateOne() / updateMany() |
| **Delete** | DELETE FROM | deleteOne() / deleteMany() |
| **Filter** | WHERE | find({ field: value }) |
| **Sort** | ORDER BY | .sort({ field: 1/-1 }) |
| **Limit** | LIMIT | .limit(n) |
| **Skip** | OFFSET | .skip(n) |
| **Join** | JOIN ON | $lookup or embed |
| **Group** | GROUP BY | $group |
| **Count** | COUNT(*) | countDocuments() |
| **Distinct** | DISTINCT | distinct() |

---

## 💡 When to Use Which?

### Use SQL When

- ✅ Complex relationships between data
- ✅ Need ACID transactions
- ✅ Data structure is well-defined and stable
- ✅ Need complex JOINs and aggregations
- ✅ Regulatory compliance (banking, finance)

### Use MongoDB When

- ✅ Flexible schema needed
- ✅ Rapid development and iteration
- ✅ Hierarchical/nested data structures
- ✅ Need horizontal scaling
- ✅ Document-oriented data (JSON-like)

---

## 📚 Additional Resources

- **SQL Tutorial**: [W3Schools SQL](https://www.w3schools.com/sql/)
- **MongoDB Docs**: [MongoDB Manual](https://docs.mongodb.com/manual/)
- **SQL vs NoSQL**: [MongoDB Comparison](https://www.mongodb.com/compare/mongodb-mysql)

Happy Learning! 🚀
