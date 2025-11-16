-- ==========================================
-- SQL QUERY PRACTICE - BASIC OPERATIONS
-- ==========================================
-- This file contains SQL queries for practice
-- You can run these in any SQL database (MySQL, PostgreSQL, SQLite)

-- ==========================================
-- 1. CREATE TABLES
-- ==========================================

-- Create Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    age INT,
    city VARCHAR(50),
    salary DECIMAL(10, 2),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Products table
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50),
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Orders table
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    total DECIMAL(10, 2),
    status VARCHAR(20),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Order_Items table (many-to-many relationship)
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    product_id INT,
    quantity INT,
    price DECIMAL(10, 2),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ==========================================
-- 2. INSERT DATA (CREATE)
-- ==========================================

-- Insert Users
INSERT INTO users (name, email, age, city, salary, active) VALUES
('Alice Johnson', 'alice@email.com', 25, 'Chennai', 50000, TRUE),
('Bob Smith', 'bob@email.com', 30, 'Mumbai', 75000, TRUE),
('Charlie Brown', 'charlie@email.com', 28, 'Delhi', 60000, FALSE),
('Diana Prince', 'diana@email.com', 35, 'Bangalore', 90000, TRUE),
('Eve Adams', 'eve@email.com', 22, 'Chennai', 45000, TRUE),
('Frank Castle', 'frank@email.com', 40, 'Pune', 100000, TRUE),
('Grace Hopper', 'grace@email.com', 27, 'Mumbai', 55000, FALSE),
('Henry Ford', 'henry@email.com', 33, 'Bangalore', 85000, TRUE);

-- Insert Products
INSERT INTO products (name, price, category, stock) VALUES
('Wireless Mouse', 29.99, 'Electronics', 150),
('USB-C Cable', 19.99, 'Electronics', 300),
('Laptop Stand', 79.99, 'Accessories', 75),
('Keyboard', 49.99, 'Electronics', 100),
('Monitor', 299.99, 'Electronics', 50),
('Desk Lamp', 39.99, 'Accessories', 120),
('Webcam', 89.99, 'Electronics', 80),
('Headphones', 129.99, 'Electronics', 90);

-- Insert Orders
INSERT INTO orders (user_id, total, status) VALUES
(1, 79.98, 'completed'),
(1, 299.99, 'shipped'),
(2, 59.98, 'processing'),
(3, 179.97, 'completed'),
(4, 349.98, 'shipped'),
(5, 29.99, 'processing');

-- Insert Order Items
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
-- Order 1 (Alice - 2 mice)
(1, 1, 2, 29.99),
-- Order 2 (Alice - 1 monitor)
(2, 5, 1, 299.99),
-- Order 3 (Bob - 1 keyboard, 1 cable)
(3, 4, 1, 49.99),
(3, 2, 1, 19.99),
-- Order 4 (Charlie - 2 headphones, 1 lamp)
(4, 8, 2, 129.99),
(4, 6, 1, 39.99),
-- Order 5 (Diana - 1 monitor, 1 webcam)
(5, 5, 1, 299.99),
(5, 7, 1, 89.99),
-- Order 6 (Eve - 1 mouse)
(6, 1, 1, 29.99);

-- ==========================================
-- 3. SELECT QUERIES (READ)
-- ==========================================

-- Basic SELECT
SELECT * FROM users;

-- Select specific columns
SELECT name, email, city FROM users;

-- WHERE clause - single condition
SELECT * FROM users WHERE city = 'Chennai';

-- WHERE clause - multiple conditions (AND)
SELECT * FROM users WHERE city = 'Chennai' AND age > 24;

-- WHERE clause - OR condition
SELECT * FROM users WHERE city = 'Chennai' OR salary > 80000;

-- Comparison operators
SELECT * FROM users WHERE age > 30;
SELECT * FROM users WHERE age >= 30;
SELECT * FROM users WHERE age < 28;
SELECT * FROM users WHERE age <= 28;
SELECT * FROM users WHERE age != 28;  -- or <>

-- IN operator
SELECT * FROM users WHERE city IN ('Chennai', 'Mumbai', 'Delhi');

-- NOT IN operator
SELECT * FROM users WHERE city NOT IN ('Chennai', 'Mumbai');

-- BETWEEN operator
SELECT * FROM users WHERE age BETWEEN 25 AND 35;
SELECT * FROM users WHERE salary BETWEEN 50000 AND 80000;

-- LIKE operator (pattern matching)
SELECT * FROM users WHERE name LIKE 'A%';        -- Starts with A
SELECT * FROM users WHERE name LIKE '%son';      -- Ends with son
SELECT * FROM users WHERE email LIKE '%@email%'; -- Contains @email

-- IS NULL / IS NOT NULL
SELECT * FROM users WHERE active IS NOT NULL;

-- ORDER BY (sorting)
SELECT * FROM users ORDER BY age ASC;          -- Ascending
SELECT * FROM users ORDER BY salary DESC;      -- Descending
SELECT * FROM users ORDER BY city ASC, salary DESC; -- Multiple columns

-- LIMIT (pagination)
SELECT * FROM users LIMIT 5;                   -- First 5 records
SELECT * FROM users LIMIT 3 OFFSET 3;          -- Skip 3, get next 3

-- DISTINCT (unique values)
SELECT DISTINCT city FROM users;
SELECT DISTINCT category FROM products;

-- ==========================================
-- 4. AGGREGATE FUNCTIONS
-- ==========================================

-- COUNT
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as active_users FROM users WHERE active = TRUE;

-- SUM
SELECT SUM(salary) as total_salary FROM users;
SELECT SUM(stock) as total_stock FROM products;

-- AVG
SELECT AVG(age) as average_age FROM users;
SELECT AVG(salary) as average_salary FROM users;
SELECT AVG(price) as average_price FROM products;

-- MIN / MAX
SELECT MIN(age) as youngest FROM users;
SELECT MAX(age) as oldest FROM users;
SELECT MIN(price) as cheapest FROM products;
SELECT MAX(price) as most_expensive FROM products;

-- GROUP BY
SELECT city, COUNT(*) as user_count 
FROM users 
GROUP BY city;

SELECT city, AVG(salary) as avg_salary 
FROM users 
GROUP BY city
ORDER BY avg_salary DESC;

SELECT category, COUNT(*) as product_count, SUM(stock) as total_stock
FROM products
GROUP BY category;

-- HAVING (filter after GROUP BY)
SELECT city, AVG(salary) as avg_salary 
FROM users 
GROUP BY city
HAVING AVG(salary) > 60000;

SELECT category, COUNT(*) as count
FROM products
GROUP BY category
HAVING COUNT(*) >= 3;

-- ==========================================
-- 5. JOINS (Combining Tables)
-- ==========================================

-- INNER JOIN (matching records from both tables)
SELECT users.name, orders.id as order_id, orders.total, orders.status
FROM users
INNER JOIN orders ON users.id = orders.user_id;

-- Get all order details with user names
SELECT 
    users.name as customer,
    users.email,
    orders.id as order_id,
    orders.total,
    orders.status,
    orders.order_date
FROM users
INNER JOIN orders ON users.id = orders.user_id
ORDER BY orders.order_date DESC;

-- LEFT JOIN (all records from left table, matching from right)
SELECT 
    users.name,
    users.email,
    orders.id as order_id,
    orders.total
FROM users
LEFT JOIN orders ON users.id = orders.user_id;

-- Multiple JOINs - Get order items with product and user details
SELECT 
    users.name as customer,
    products.name as product,
    order_items.quantity,
    order_items.price,
    (order_items.quantity * order_items.price) as subtotal
FROM order_items
INNER JOIN orders ON order_items.order_id = orders.id
INNER JOIN users ON orders.user_id = users.id
INNER JOIN products ON order_items.product_id = products.id;

-- Self JOIN example (users from same city)
SELECT 
    u1.name as user1,
    u2.name as user2,
    u1.city
FROM users u1
INNER JOIN users u2 ON u1.city = u2.city AND u1.id < u2.id
ORDER BY u1.city;

-- ==========================================
-- 6. UPDATE QUERIES (MODIFY)
-- ==========================================

-- Update single field
UPDATE users 
SET age = 29 
WHERE email = 'alice@email.com';

-- Update multiple fields
UPDATE users 
SET age = 29, city = 'Bangalore' 
WHERE id = 1;

-- Update based on calculation
UPDATE products 
SET price = price * 1.1 
WHERE category = 'Electronics';

-- Update using subquery
UPDATE users 
SET active = FALSE 
WHERE id IN (
    SELECT user_id FROM orders WHERE status = 'cancelled'
);

-- ⚠️ WARNING: Without WHERE, updates ALL rows!
-- UPDATE users SET age = 30;  -- Don't run this!

-- ==========================================
-- 7. DELETE QUERIES (REMOVE)
-- ==========================================

-- Delete specific record
DELETE FROM users WHERE id = 1;

-- Delete with condition
DELETE FROM products WHERE stock = 0;

-- Delete using subquery
DELETE FROM users 
WHERE id IN (
    SELECT user_id FROM orders WHERE status = 'cancelled'
);

-- ⚠️ WARNING: Without WHERE, deletes ALL rows!
-- DELETE FROM users;  -- Don't run this!

-- ==========================================
-- 8. ADVANCED QUERIES
-- ==========================================

-- Subquery in SELECT
SELECT 
    name,
    salary,
    (SELECT AVG(salary) FROM users) as avg_salary,
    salary - (SELECT AVG(salary) FROM users) as difference
FROM users;

-- Subquery in WHERE (find users earning more than average)
SELECT name, salary
FROM users
WHERE salary > (SELECT AVG(salary) FROM users);

-- EXISTS operator
SELECT name, email
FROM users
WHERE EXISTS (
    SELECT 1 FROM orders WHERE orders.user_id = users.id
);

-- CASE statement (conditional logic)
SELECT 
    name,
    age,
    CASE 
        WHEN age < 25 THEN 'Young'
        WHEN age BETWEEN 25 AND 35 THEN 'Mid-Career'
        ELSE 'Senior'
    END as age_group
FROM users;

-- Window functions (ranking)
SELECT 
    name,
    salary,
    RANK() OVER (ORDER BY salary DESC) as salary_rank
FROM users;

-- ==========================================
-- 9. INDEXES (Performance Optimization)
-- ==========================================

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);

-- Create index on multiple columns
CREATE INDEX idx_users_city_age ON users(city, age);

-- Create unique index
CREATE UNIQUE INDEX idx_users_email_unique ON users(email);

-- View indexes
SHOW INDEX FROM users;

-- Drop index
DROP INDEX idx_users_city_age ON users;

-- ==========================================
-- 10. TRANSACTIONS (ACID Compliance)
-- ==========================================

-- Start transaction
START TRANSACTION;

-- Multiple operations
UPDATE products SET stock = stock - 1 WHERE id = 1;
INSERT INTO orders (user_id, total, status) VALUES (1, 29.99, 'processing');

-- Commit if everything is OK
COMMIT;

-- Or rollback if there's an error
-- ROLLBACK;

-- ==========================================
-- 11. USEFUL QUERIES FOR PRACTICE
-- ==========================================

-- Find top 5 highest-paid users
SELECT name, salary 
FROM users 
ORDER BY salary DESC 
LIMIT 5;

-- Find users who haven't placed any orders
SELECT users.name, users.email
FROM users
LEFT JOIN orders ON users.id = orders.user_id
WHERE orders.id IS NULL;

-- Count orders by status
SELECT status, COUNT(*) as order_count
FROM orders
GROUP BY status;

-- Find total revenue by user
SELECT 
    users.name,
    COUNT(orders.id) as order_count,
    SUM(orders.total) as total_spent
FROM users
INNER JOIN orders ON users.id = orders.user_id
GROUP BY users.id, users.name
ORDER BY total_spent DESC;

-- Find most popular products (by order quantity)
SELECT 
    products.name,
    SUM(order_items.quantity) as total_ordered,
    COUNT(DISTINCT order_items.order_id) as times_ordered
FROM products
INNER JOIN order_items ON products.id = order_items.product_id
GROUP BY products.id, products.name
ORDER BY total_ordered DESC;

-- Find products that have never been ordered
SELECT products.name
FROM products
LEFT JOIN order_items ON products.id = order_items.product_id
WHERE order_items.id IS NULL;

-- Calculate average order value
SELECT AVG(total) as average_order_value
FROM orders;

-- Find users with multiple orders
SELECT 
    users.name,
    COUNT(orders.id) as order_count
FROM users
INNER JOIN orders ON users.id = orders.user_id
GROUP BY users.id, users.name
HAVING COUNT(orders.id) > 1;

-- ==========================================
-- 12. CLEANUP (DROP TABLES)
-- ==========================================

-- Drop tables in reverse order (respect foreign keys)
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

-- ==========================================
-- END OF SQL PRACTICE QUERIES
-- ==========================================
