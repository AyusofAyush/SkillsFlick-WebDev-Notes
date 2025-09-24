# Session 8: Modern JavaScript - Practice Solutions

---

## 📚 Table of Contents

- [Session 8: Modern JavaScript - Practice Solutions](#session-8-modern-javascript---practice-solutions)
  - [📚 Table of Contents](#-table-of-contents)
  - [Practice Exercise 1: Destructuring Assignment](#practice-exercise-1-destructuring-assignment)
    - [🎯 Question](#-question)
    - [✅ Solution](#-solution)
  - [Practice Exercise 2: Spread Operator \& Rest Parameters](#practice-exercise-2-spread-operator--rest-parameters)
    - [🎯 Questions](#-questions)
    - [✅ Solutions](#-solutions)
  - [Practice Exercise 3: Array Methods (map, filter, reduce)](#practice-exercise-3-array-methods-map-filter-reduce)
    - [🎯 Questions](#-questions-1)
    - [✅ Solutions](#-solutions-1)
  - [Practice Exercise 4: Arrow Functions \& Modern Syntax](#practice-exercise-4-arrow-functions--modern-syntax)
    - [🎯 Questions](#-questions-2)
    - [✅ Solutions](#-solutions-2)
  - [Final Challenge: Complete Refactoring](#final-challenge-complete-refactoring)
    - [🎯 Questions](#-questions-3)
    - [✅ Solutions](#-solutions-3)
  - [🎉 Summary](#-summary)
    - [✅ **Key Concepts Mastered:**](#-key-concepts-mastered)
    - [🚀 **Benefits of Modern JavaScript:**](#-benefits-of-modern-javascript)
    - [💡 **Next Steps:**](#-next-steps)

---

## Practice Exercise 1: Destructuring Assignment

### 🎯 Question

```javascript
// TODO: Use destructuring to solve this
const studentGrades = {
    name: 'Emma',
    subjects: {
        math: 95,
        science: 88,
        english: 92,
        history: 85
    },
    extracurricular: ['debate', 'chess', 'coding']
};

// Extract: name, math grade, first extracurricular activity
// Your solution here:
```

### ✅ Solution

```javascript
// 🎓 Destructuring Assignment Solution

const studentGrades = {
    name: 'Emma',
    subjects: {
        math: 95,
        science: 88,
        english: 92,
        history: 85
    },
    extracurricular: ['debate', 'chess', 'coding']
};

// ✨ Solution using nested destructuring
const { 
    name,                                    // Extract name from top level
    subjects: { math },                      // Extract math from nested subjects object
    extracurricular: [firstActivity]        // Extract first element from array
} = studentGrades;

// 📊 Display results
console.log(`Student: ${name}`);               // Student: Emma
console.log(`Math Grade: ${math}`);            // Math Grade: 95
console.log(`First Activity: ${firstActivity}`); // First Activity: debate

// 🎯 Alternative approach with renaming
const { 
    name: studentName, 
    subjects: { math: mathGrade }, 
    extracurricular: [primaryActivity] 
} = studentGrades;

console.log(`${studentName} scored ${mathGrade} in math and does ${primaryActivity}`);
// Emma scored 95 in math and does debate
```

---

## Practice Exercise 2: Spread Operator & Rest Parameters

### 🎯 Questions

```javascript
// TODO: Complete these functions using spread/rest

// 1. Create a function that finds the maximum of any number of arguments
function findMax(...numbers) {
    // Your solution here
}

// 2. Merge these three arrays into one
const fruits = ['apple', 'banana'];
const vegetables = ['carrot', 'spinach'];
const grains = ['rice', 'wheat'];
// Your solution here:

// 3. Clone this object and add a new property
const car = { brand: 'Toyota', model: 'Camry', year: 2020 };
// Add property: color: 'blue'
// Your solution here:
```

### ✅ Solutions

```javascript
// 🌊 Spread Operator & Rest Parameters Solutions

// 1. 🔢 Find maximum using rest parameters
function findMax(...numbers) {
    // Handle edge case: no arguments provided
    if (numbers.length === 0) {
        return undefined;
    }
    
    // Use Math.max with spread operator to find maximum
    return Math.max(...numbers);
}

// 🧪 Test the function
console.log(findMax(10, 25, 5, 30)); // 30
console.log(findMax(100));           // 100
console.log(findMax());              // undefined

// 💡 Alternative solution using reduce
function findMaxAlternative(...numbers) {
    return numbers.reduce((max, current) => current > max ? current : max, -Infinity);
}

// 2. 🥗 Merge arrays using spread operator
const fruits = ['apple', 'banana'];
const vegetables = ['carrot', 'spinach'];
const grains = ['rice', 'wheat'];

// ✨ Solution: Combine all arrays
const groceryList = [...fruits, ...vegetables, ...grains];
console.log(groceryList); 
// ['apple', 'banana', 'carrot', 'spinach', 'rice', 'wheat']

// 🎯 Alternative: Create categorized grocery list
const categorizedGroceries = {
    fruits: [...fruits],
    vegetables: [...vegetables], 
    grains: [...grains],
    all: [...fruits, ...vegetables, ...grains]
};

console.log(categorizedGroceries);

// 3. 🚗 Clone object and add new property
const car = { brand: 'Toyota', model: 'Camry', year: 2020 };

// ✨ Solution: Clone and extend object
const carWithColor = { 
    ...car,           // Spread existing properties
    color: 'blue'     // Add new property
};

console.log(carWithColor); 
// { brand: 'Toyota', model: 'Camry', year: 2020, color: 'blue' }

// 🎨 Alternative: Multiple new properties
const enhancedCar = {
    ...car,
    color: 'blue',
    mileage: 15000,
    isUsed: true
};

console.log(enhancedCar);

// 💡 Bonus: Function to add properties to any object
function addProperties(originalObject, newProperties) {
    return { ...originalObject, ...newProperties };
}

const updatedCar = addProperties(car, { color: 'red', transmission: 'automatic' });
console.log(updatedCar);
```

---

## Practice Exercise 3: Array Methods (map, filter, reduce)

### 🎯 Questions

```javascript
const employees = [
    { name: 'Alice', department: 'Engineering', salary: 95000, experience: 5 },
    { name: 'Bob', department: 'Marketing', salary: 65000, experience: 3 },
    { name: 'Charlie', department: 'Engineering', salary: 105000, experience: 8 },
    { name: 'Diana', department: 'Sales', salary: 75000, experience: 6 },
    { name: 'Eve', department: 'Engineering', salary: 110000, experience: 7 }
];

// TODO: Using map, filter, and reduce:

// 1. Get names of all Engineering employees
// Your solution:

// 2. Find employees with salary > 80000 and experience > 5 years
// Your solution:

// 3. Calculate average salary of all employees
// Your solution:

// 4. Create a summary: { department: average_salary } for Engineering dept
// Your solution:
```

### ✅ Solutions

```javascript
// 🏢 Array Methods Solutions

const employees = [
    { name: 'Alice', department: 'Engineering', salary: 95000, experience: 5 },
    { name: 'Bob', department: 'Marketing', salary: 65000, experience: 3 },
    { name: 'Charlie', department: 'Engineering', salary: 105000, experience: 8 },
    { name: 'Diana', department: 'Sales', salary: 75000, experience: 6 },
    { name: 'Eve', department: 'Engineering', salary: 110000, experience: 7 }
];

// 1. 👥 Get names of all Engineering employees
const engineeringNames = employees
    .filter(employee => employee.department === 'Engineering')  // Filter by department
    .map(employee => employee.name);                            // Extract names

console.log('Engineering employees:', engineeringNames);
// ['Alice', 'Charlie', 'Eve']

// 2. 💰 Find employees with salary > 80000 and experience > 5 years
const seniorHighEarners = employees.filter(employee => 
    employee.salary > 80000 && employee.experience > 5
);

console.log('Senior high earners:', seniorHighEarners);
// [
//   { name: 'Charlie', department: 'Engineering', salary: 105000, experience: 8 },
//   { name: 'Eve', department: 'Engineering', salary: 110000, experience: 7 }
// ]

// 🎯 Alternative: Get just their names and salaries
const seniorHighEarnersInfo = employees
    .filter(employee => employee.salary > 80000 && employee.experience > 5)
    .map(employee => ({ name: employee.name, salary: employee.salary }));

console.log('Senior high earners info:', seniorHighEarnersInfo);

// 3. 📊 Calculate average salary of all employees
const averageSalary = employees
    .reduce((total, employee) => total + employee.salary, 0) / employees.length;

console.log(`Average salary: $${averageSalary.toFixed(2)}`);
// Average salary: $90000.00

// 💡 Alternative: More detailed calculation
const salaryStats = employees.reduce((stats, employee) => {
    stats.total += employee.salary;
    stats.count += 1;
    stats.average = stats.total / stats.count;
    return stats;
}, { total: 0, count: 0, average: 0 });

console.log('Salary statistics:', salaryStats);

// 4. 🏗️ Create summary: { department: average_salary } for Engineering dept
const engineeringAverage = employees
    .filter(employee => employee.department === 'Engineering')
    .reduce((sum, employee, index, array) => {
        if (index === array.length - 1) {
            // Last iteration: return the average
            return { Engineering: (sum + employee.salary) / array.length };
        }
        // Not last iteration: accumulate sum
        return sum + employee.salary;
    }, 0);

console.log('Engineering department average:', engineeringAverage);
// { Engineering: 103333.33 }

// 🎯 Alternative: More comprehensive department analysis
const departmentSummary = employees.reduce((summary, employee) => {
    const dept = employee.department;
    
    if (!summary[dept]) {
        summary[dept] = { totalSalary: 0, count: 0, averageSalary: 0 };
    }
    
    summary[dept].totalSalary += employee.salary;
    summary[dept].count += 1;
    summary[dept].averageSalary = summary[dept].totalSalary / summary[dept].count;
    
    return summary;
}, {});

console.log('Complete department summary:', departmentSummary);

// 🏆 Bonus: Most comprehensive analysis
const comprehensiveAnalysis = {
    totalEmployees: employees.length,
    averageSalary: employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length,
    highestPaid: employees.reduce((max, emp) => emp.salary > max.salary ? emp : max),
    departmentBreakdown: employees.reduce((breakdown, emp) => {
        const dept = emp.department;
        if (!breakdown[dept]) {
            breakdown[dept] = { employees: [], avgSalary: 0, count: 0 };
        }
        breakdown[dept].employees.push(emp.name);
        breakdown[dept].count += 1;
        return breakdown;
    }, {}),
    experienceLevels: {
        junior: employees.filter(emp => emp.experience < 5).length,
        mid: employees.filter(emp => emp.experience >= 5 && emp.experience < 8).length,
        senior: employees.filter(emp => emp.experience >= 8).length
    }
};

// Calculate average salaries for each department
Object.keys(comprehensiveAnalysis.departmentBreakdown).forEach(dept => {
    const deptEmployees = employees.filter(emp => emp.department === dept);
    const avgSalary = deptEmployees.reduce((sum, emp) => sum + emp.salary, 0) / deptEmployees.length;
    comprehensiveAnalysis.departmentBreakdown[dept].avgSalary = Math.round(avgSalary);
});

console.log('📈 Comprehensive Analysis:', comprehensiveAnalysis);
```

---

## Practice Exercise 4: Arrow Functions & Modern Syntax

### 🎯 Questions

```javascript
// TODO: Refactor these functions using modern syntax

// 1. Convert to arrow function with template literals
function createWelcomeMessage(firstName, lastName, company) {
    return 'Welcome to ' + company + ', ' + firstName + ' ' + lastName + '!';
}

// Your solution:

// 2. Use enhanced object literals and default parameters
function createProduct(name, price, category, inStock) {
    return {
        name: name,
        price: price,
        category: category,
        inStock: inStock,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        getDisplayPrice: function() {
            return '$' + this.price.toFixed(2);
        }
    };
}

// Your solution:

// 3. Refactor using modern array methods and arrow functions
function processOrders(orders) {
    var completedOrders = [];
    for (var i = 0; i < orders.length; i++) {
        if (orders[i].status === 'completed') {
            completedOrders.push(orders[i]);
        }
    }
    
    var totalRevenue = 0;
    for (var j = 0; j < completedOrders.length; j++) {
        totalRevenue += completedOrders[j].amount;
    }
    
    return {
        orders: completedOrders,
        total: totalRevenue,
        count: completedOrders.length
    };
}

// Your solution:
```

### ✅ Solutions

```javascript
// 🏹 Arrow Functions & Modern Syntax Solutions

// 1. 🎉 Convert to arrow function with template literals
function createWelcomeMessage(firstName, lastName, company) {
    return 'Welcome to ' + company + ', ' + firstName + ' ' + lastName + '!';
}

// ✨ Modern solution with arrow function and template literals
const createWelcomeMessage = (firstName, lastName, company) => 
    `Welcome to ${company}, ${firstName} ${lastName}!`;

// 🧪 Test the function
console.log(createWelcomeMessage('John', 'Doe', 'TechCorp'));
// "Welcome to TechCorp, John Doe!"

// 💡 Alternative with default parameters
const createWelcomeMessageWithDefaults = (
    firstName = 'Guest', 
    lastName = '', 
    company = 'our company'
) => `Welcome to ${company}, ${firstName} ${lastName}!`.trim();

console.log(createWelcomeMessageWithDefaults()); // "Welcome to our company, Guest!"

// 2. 🛍️ Enhanced object literals and default parameters
function createProduct(name, price, category, inStock) {
    return {
        name: name,
        price: price,
        category: category,
        inStock: inStock,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        getDisplayPrice: function() {
            return '$' + this.price.toFixed(2);
        }
    };
}

// ✨ Modern solution with enhanced object literals and defaults
const createProduct = (
    name, 
    price, 
    category = 'general', 
    inStock = true
) => ({
    name,                                           // Property shorthand
    price,                                          // Property shorthand  
    category,                                       // Property shorthand
    inStock,                                        // Property shorthand
    id: Math.random().toString(36).substr(2, 9),   // Generated ID
    createdAt: new Date(),                          // Timestamp
    
    // 🎯 Method shorthand syntax
    getDisplayPrice() {
        return `$${this.price.toFixed(2)}`;         // Template literal
    },
    
    // 🏷️ Additional methods using modern syntax
    getStatus: () => inStock ? 'Available' : 'Out of Stock',
    
    getDescription() {
        return `${this.name} - ${this.getDisplayPrice()} (${this.category})`;
    },
    
    // 📊 Computed property names
    [`is${category.charAt(0).toUpperCase() + category.slice(1)}`]: true
});

// 🧪 Test the function
const laptop = createProduct('MacBook Pro', 1299.99, 'electronics');
console.log(laptop);
console.log(laptop.getDescription()); // "MacBook Pro - $1299.99 (electronics)"
console.log(laptop.isElectronics);    // true

// 3. 📦 Process orders with modern array methods
function processOrders(orders) {
    var completedOrders = [];
    for (var i = 0; i < orders.length; i++) {
        if (orders[i].status === 'completed') {
            completedOrders.push(orders[i]);
        }
    }
    
    var totalRevenue = 0;
    for (var j = 0; j < completedOrders.length; j++) {
        totalRevenue += completedOrders[j].amount;
    }
    
    return {
        orders: completedOrders,
        total: totalRevenue,
        count: completedOrders.length
    };
}

// ✨ Modern solution with array methods and arrow functions
const processOrders = (orders) => {
    // 🔍 Filter completed orders
    const completedOrders = orders.filter(order => order.status === 'completed');
    
    // 💰 Calculate total revenue using reduce
    const totalRevenue = completedOrders.reduce((total, order) => total + order.amount, 0);
    
    // 📊 Return enhanced result object
    return {
        orders: completedOrders,
        total: totalRevenue,
        count: completedOrders.length,
        
        // 🎯 Additional computed properties
        averageOrderValue: completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0,
        summary: `${completedOrders.length} completed orders worth $${totalRevenue.toFixed(2)}`
    };
};

// 🧪 Test data and function
const sampleOrders = [
    { id: 1, amount: 100, status: 'completed' },
    { id: 2, amount: 50, status: 'pending' },
    { id: 3, amount: 75, status: 'completed' },
    { id: 4, amount: 200, status: 'cancelled' },
    { id: 5, amount: 150, status: 'completed' }
];

const result = processOrders(sampleOrders);
console.log(result);
/* Output:
{
  orders: [
    { id: 1, amount: 100, status: 'completed' },
    { id: 3, amount: 75, status: 'completed' },
    { id: 5, amount: 150, status: 'completed' }
  ],
  total: 325,
  count: 3,
  averageOrderValue: 108.33,
  summary: "3 completed orders worth $325.00"
}
*/

// 💡 One-liner version for advanced users
const processOrdersOneLiner = orders => ({
    ...(orders => ({
        orders: orders.filter(o => o.status === 'completed'),
        total: orders.filter(o => o.status === 'completed').reduce((t, o) => t + o.amount, 0),
        count: orders.filter(o => o.status === 'completed').length
    }))(orders)
});

// 🎯 Most optimized version (single pass through array)
const processOrdersOptimized = orders => 
    orders.reduce((result, order) => {
        if (order.status === 'completed') {
            result.orders.push(order);
            result.total += order.amount;
            result.count += 1;
        }
        return result;
    }, { orders: [], total: 0, count: 0 });
```

---

## Final Challenge: Complete Refactoring

### 🎯 Questions

```javascript
// TODO: Complete the refactoring exercise

// 1. Refactor this shopping cart function using modern JavaScript:
function ShoppingCart() {
    this.items = [];
    this.total = 0;
}

ShoppingCart.prototype.addItem = function(name, price, quantity) {
    var item = {
        name: name,
        price: price,
        quantity: quantity,
        subtotal: price * quantity
    };
    this.items.push(item);
    this.calculateTotal();
};

ShoppingCart.prototype.calculateTotal = function() {
    var total = 0;
    for (var i = 0; i < this.items.length; i++) {
        total += this.items[i].subtotal;
    }
    this.total = total;
};

// Your modern refactored version:

// 2. Convert this data processing pipeline:
function processUserData(users) {
    var adults = [];
    for (var i = 0; i < users.length; i++) {
        if (users[i].age >= 18) {
            adults.push(users[i]);
        }
    }
    
    var processedUsers = [];
    for (var j = 0; j < adults.length; j++) {
        processedUsers.push({
            fullName: adults[j].firstName + ' ' + adults[j].lastName,
            age: adults[j].age,
            isAdult: true
        });
    }
    
    return {
        total: processedUsers.length,
        users: processedUsers
    };
}

// Your modern version using array methods:

// 3. Create a modern API client class with async/await:
// - Should have methods for GET, POST, PUT, DELETE
// - Use template literals for URL construction
// - Include error handling
// - Use modern class syntax

// Your solution:
```

### ✅ Solutions

```javascript
// 🏆 Final Challenge Solutions

// 1. 🛒 Modern Shopping Cart Class
function ShoppingCart() {
    this.items = [];
    this.total = 0;
}

ShoppingCart.prototype.addItem = function(name, price, quantity) {
    var item = {
        name: name,
        price: price,
        quantity: quantity,
        subtotal: price * quantity
    };
    this.items.push(item);
    this.calculateTotal();
};

ShoppingCart.prototype.calculateTotal = function() {
    var total = 0;
    for (var i = 0; i < this.items.length; i++) {
        total += this.items[i].subtotal;
    }
    this.total = total;
};

// ✨ Modern Shopping Cart with ES6 Classes
class ShoppingCart {
    constructor() {
        this.items = [];
        this.discounts = [];
        this.taxRate = 0.08; // 8% tax rate
    }

    // 🛍️ Add item with enhanced features
    addItem(name, price, quantity = 1, category = 'general') {
        const item = {
            id: this.generateId(),
            name,
            price,
            quantity,
            category,
            subtotal: price * quantity,
            addedAt: new Date()
        };
        
        this.items.push(item);
        this.calculateTotals();
        return item.id; // Return ID for reference
    }

    // 🗑️ Remove item by ID
    removeItem(itemId) {
        const initialLength = this.items.length;
        this.items = this.items.filter(item => item.id !== itemId);
        
        if (this.items.length < initialLength) {
            this.calculateTotals();
            return true;
        }
        return false;
    }

    // 📝 Update item quantity
    updateQuantity(itemId, newQuantity) {
        const item = this.items.find(item => item.id === itemId);
        if (item && newQuantity > 0) {
            item.quantity = newQuantity;
            item.subtotal = item.price * newQuantity;
            this.calculateTotals();
            return true;
        }
        return false;
    }

    // 🏷️ Apply discount
    addDiscount(type, value, description = '') {
        this.discounts.push({ type, value, description });
        this.calculateTotals();
    }

    // 🧮 Calculate all totals using modern array methods
    calculateTotals() {
        // Calculate subtotal
        this.subtotal = this.items.reduce((total, item) => total + item.subtotal, 0);
        
        // Calculate discount amount
        this.discountAmount = this.discounts.reduce((total, discount) => {
            return total + (discount.type === 'percentage' 
                ? this.subtotal * (discount.value / 100)
                : discount.value);
        }, 0);
        
        // Calculate tax and final total
        this.afterDiscount = this.subtotal - this.discountAmount;
        this.taxAmount = this.afterDiscount * this.taxRate;
        this.total = this.afterDiscount + this.taxAmount;
    }

    // 📊 Get cart summary
    getSummary() {
        return {
            itemCount: this.items.length,
            totalQuantity: this.items.reduce((sum, item) => sum + item.quantity, 0),
            subtotal: this.subtotal?.toFixed(2) || '0.00',
            discountAmount: this.discountAmount?.toFixed(2) || '0.00',
            taxAmount: this.taxAmount?.toFixed(2) || '0.00',
            total: this.total?.toFixed(2) || '0.00',
            categories: this.getCategorySummary()
        };
    }

    // 📈 Category breakdown
    getCategorySummary() {
        return this.items.reduce((categories, item) => {
            if (!categories[item.category]) {
                categories[item.category] = { count: 0, total: 0 };
            }
            categories[item.category].count += item.quantity;
            categories[item.category].total += item.subtotal;
            return categories;
        }, {});
    }

    // 🆔 Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // 🧹 Clear cart
    clear() {
        this.items = [];
        this.discounts = [];
        this.calculateTotals();
    }

    // 💾 Export cart data
    export() {
        return {
            items: [...this.items],
            discounts: [...this.discounts],
            summary: this.getSummary(),
            exportedAt: new Date()
        };
    }
}

// 🧪 Test the modern shopping cart
const cart = new ShoppingCart();
cart.addItem('MacBook Pro', 1299.99, 1, 'electronics');
cart.addItem('Coffee Mug', 12.99, 2, 'accessories');
cart.addDiscount('percentage', 10, '10% off everything');

console.log('🛒 Cart Summary:', cart.getSummary());

// 2. 👥 Modern User Data Processing
function processUserData(users) {
    var adults = [];
    for (var i = 0; i < users.length; i++) {
        if (users[i].age >= 18) {
            adults.push(users[i]);
        }
    }
    
    var processedUsers = [];
    for (var j = 0; j < adults.length; j++) {
        processedUsers.push({
            fullName: adults[j].firstName + ' ' + adults[j].lastName,
            age: adults[j].age,
            isAdult: true
        });
    }
    
    return {
        total: processedUsers.length,
        users: processedUsers
    };
}

// ✨ Modern version using array methods and enhanced features
const processUserData = (users) => {
    const processedUsers = users
        .filter(user => user.age >= 18)  // Filter adults only
        .map(user => ({                  // Transform user data
            id: user.id || Date.now() + Math.random(),
            fullName: `${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age,
            isAdult: true,
            ageGroup: user.age < 30 ? 'young-adult' : 
                     user.age < 50 ? 'middle-aged' : 'senior',
            initials: `${user.firstName[0]}${user.lastName[0]}`.toUpperCase(),
            processedAt: new Date()
        }));

    // 📊 Additional analytics
    const analytics = {
        totalUsers: users.length,
        adultsCount: processedUsers.length,
        minorsCount: users.length - processedUsers.length,
        averageAge: processedUsers.reduce((sum, user) => sum + user.age, 0) / processedUsers.length || 0,
        ageDistribution: processedUsers.reduce((dist, user) => {
            dist[user.ageGroup] = (dist[user.ageGroup] || 0) + 1;
            return dist;
        }, {}),
        oldestUser: processedUsers.reduce((oldest, user) => 
            user.age > (oldest?.age || 0) ? user : oldest, null),
        youngestUser: processedUsers.reduce((youngest, user) => 
            user.age < (youngest?.age || Infinity) ? user : youngest, null)
    };

    return {
        total: processedUsers.length,
        users: processedUsers,
        analytics,
        
        // 🎯 Utility methods
        getByAgeGroup: (ageGroup) => processedUsers.filter(user => user.ageGroup === ageGroup),
        searchByName: (searchTerm) => processedUsers.filter(user => 
            user.fullName.toLowerCase().includes(searchTerm.toLowerCase())),
        sortByAge: (ascending = true) => [...processedUsers].sort((a, b) => 
            ascending ? a.age - b.age : b.age - a.age)
    };
};

// 🧪 Test data
const testUsers = [
    { firstName: 'John', lastName: 'Doe', age: 25 },
    { firstName: 'Jane', lastName: 'Smith', age: 17 },
    { firstName: 'Bob', lastName: 'Johnson', age: 35 },
    { firstName: 'Alice', lastName: 'Brown', age: 16 },
    { firstName: 'Charlie', lastName: 'Wilson', age: 45 }
];

const result = processUserData(testUsers);
console.log('👥 Processed User Data:', result);

// 3. 🌐 Modern API Client Class
class APIClient {
    constructor(baseURL, options = {}) {
        this.baseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        this.timeout = options.timeout || 10000;
        this.retryAttempts = options.retryAttempts || 3;
        this.retryDelay = options.retryDelay || 1000;
    }

    // 🛠️ Build complete URL
    buildURL(endpoint, params = {}) {
        const url = `${this.baseURL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
        
        if (Object.keys(params).length === 0) return url;
        
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                searchParams.append(key, value);
            }
        });
        
        return `${url}?${searchParams.toString()}`;
    }

    // 🚀 Generic request method with retry logic
    async makeRequest(method, endpoint, options = {}) {
        const { data, params, headers = {}, ...fetchOptions } = options;
        
        const config = {
            method: method.toUpperCase(),
            headers: { ...this.defaultHeaders, ...headers },
            ...fetchOptions
        };

        // Add body for POST, PUT, PATCH requests
        if (data && ['POST', 'PUT', 'PATCH'].includes(config.method)) {
            config.body = JSON.stringify(data);
        }

        const url = this.buildURL(endpoint, params);
        
        // Implement retry logic
        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.timeout);
                
                const response = await fetch(url, {
                    ...config,
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new APIError(`HTTP ${response.status}: ${response.statusText}`, {
                        status: response.status,
                        statusText: response.statusText,
                        url,
                        method: config.method
                    });
                }
                
                const contentType = response.headers.get('content-type');
                const responseData = contentType?.includes('application/json') 
                    ? await response.json() 
                    : await response.text();
                
                return {
                    data: responseData,
                    status: response.status,
                    statusText: response.statusText,
                    headers: Object.fromEntries(response.headers.entries()),
                    config: { url, method: config.method }
                };
                
            } catch (error) {
                console.warn(`Attempt ${attempt} failed:`, error.message);
                
                if (attempt === this.retryAttempts) {
                    throw error;
                }
                
                // Wait before retrying
                await this.delay(this.retryDelay * attempt);
            }
        }
    }

    // 🕐 Delay utility
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 📥 GET request
    async get(endpoint, params = {}, options = {}) {
        return this.makeRequest('GET', endpoint, { params, ...options });
    }

    // 📤 POST request
    async post(endpoint, data = {}, options = {}) {
        return this.makeRequest('POST', endpoint, { data, ...options });
    }

    // 🔧 PUT request
    async put(endpoint, data = {}, options = {}) {
        return this.makeRequest('PUT', endpoint, { data, ...options });
    }

    // 🔄 PATCH request
    async patch(endpoint, data = {}, options = {}) {
        return this.makeRequest('PATCH', endpoint, { data, ...options });
    }

    // 🗑️ DELETE request
    async delete(endpoint, options = {}) {
        return this.makeRequest('DELETE', endpoint, options);
    }

    // 🎯 Convenience methods for common patterns
    async getById(resource, id, options = {}) {
        return this.get(`${resource}/${id}`, {}, options);
    }

    async create(resource, data, options = {}) {
        return this.post(resource, data, options);
    }

    async update(resource, id, data, options = {}) {
        return this.put(`${resource}/${id}`, data, options);
    }

    async partialUpdate(resource, id, data, options = {}) {
        return this.patch(`${resource}/${id}`, data, options);
    }

    async remove(resource, id, options = {}) {
        return this.delete(`${resource}/${id}`, options);
    }

    // 📊 Batch operations
    async batchRequest(requests) {
        const promises = requests.map(async ({ method, endpoint, data, options = {} }) => {
            try {
                const result = await this.makeRequest(method, endpoint, { data, ...options });
                return { success: true, result };
            } catch (error) {
                return { success: false, error: error.message };
            }
        });

        return Promise.all(promises);
    }

    // 🔗 Set authentication
    setAuth(token, type = 'Bearer') {
        this.defaultHeaders.Authorization = `${type} ${token}`;
    }

    // 🧹 Clear authentication
    clearAuth() {
        delete this.defaultHeaders.Authorization;
    }
}

// 🚨 Custom API Error class
class APIError extends Error {
    constructor(message, details = {}) {
        super(message);
        this.name = 'APIError';
        this.details = details;
    }
}

// 🧪 Usage Examples
const api = new APIClient('https://jsonplaceholder.typicode.com', {
    timeout: 5000,
    retryAttempts: 2,
    headers: {
        'X-App-Version': '1.0.0'
    }
});

// Example usage
async function demonstrateAPIClient() {
    try {
        // 📥 Get all users
        const users = await api.get('/users');
        console.log('Users:', users.data);

        // 📥 Get specific user
        const user = await api.getById('users', 1);
        console.log('User 1:', user.data);

        // 📤 Create new post
        const newPost = await api.create('posts', {
            title: 'My New Post',
            body: 'This is the content of my post',
            userId: 1
        });
        console.log('Created post:', newPost.data);

        // 🔄 Update post
        const updatedPost = await api.update('posts', 1, {
            title: 'Updated Post Title',
            body: 'Updated content',
            userId: 1
        });
        console.log('Updated post:', updatedPost.data);

        // 🗑️ Delete post
        await api.remove('posts', 1);
        console.log('Post deleted successfully');

        // 📊 Batch requests
        const batchResults = await api.batchRequest([
            { method: 'GET', endpoint: '/users/1' },
            { method: 'GET', endpoint: '/users/2' },
            { method: 'GET', endpoint: '/posts', options: { params: { userId: 1 } } }
        ]);
        console.log('Batch results:', batchResults);

    } catch (error) {
        console.error('API Error:', error.message);
        if (error instanceof APIError) {
            console.error('Error details:', error.details);
        }
    }
}

// 🎯 Advanced API Client with specialized methods
class AdvancedAPIClient extends APIClient {
    constructor(baseURL, options = {}) {
        super(baseURL, options);
        this.cache = new Map();
        this.cacheTimeout = options.cacheTimeout || 5 * 60 * 1000; // 5 minutes
    }

    // 💾 Cached GET request
    async getCached(endpoint, params = {}, options = {}) {
        const cacheKey = `${endpoint}-${JSON.stringify(params)}`;
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            console.log('📦 Returning cached data for:', cacheKey);
            return cached.data;
        }
        
        const result = await this.get(endpoint, params, options);
        this.cache.set(cacheKey, {
            data: result,
            timestamp: Date.now()
        });
        
        return result;
    }

    // 🧹 Clear cache
    clearCache() {
        this.cache.clear();
    }

    // 📊 Get cache stats
    getCacheStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }
}

console.log('🚀 Modern JavaScript solutions implemented successfully!');
```

---

## 🎉 Summary

This solutions file demonstrates the power of modern JavaScript by showcasing:

### ✅ **Key Concepts Mastered:**

1. **🎭 Destructuring Assignment**
   - Array and object destructuring
   - Nested destructuring
   - Default values and renaming

2. **🌊 Spread Operator & Rest Parameters**
   - Array and object spreading
   - Function parameters
   - Cloning and merging

3. **🔄 Array Methods**
   - `map()` for transformations
   - `filter()` for selections  
   - `reduce()` for aggregations
   - Method chaining

4. **🏹 Arrow Functions & Modern Syntax**
   - Concise function syntax
   - Template literals
   - Enhanced object literals
   - Default parameters

5. **🏗️ Advanced Patterns**
   - ES6 Classes
   - Async/await patterns
   - Error handling
   - Method chaining

### 🚀 **Benefits of Modern JavaScript:**

- **📖 Readability**: Code is more expressive and easier to understand
- **🎯 Conciseness**: Less boilerplate, more functionality
- **🛡️ Reliability**: Better error handling and type safety patterns
- **⚡ Performance**: Optimized operations and reduced memory usage
- **🔧 Maintainability**: Modular, reusable code structures

### 💡 **Next Steps:**

- Practice these patterns in real projects
- Explore TypeScript for additional type safety
- Learn React/Vue.js which heavily use these concepts
- Study advanced async patterns and state management

*Happy coding! 🎉 Modern JavaScript makes development more enjoyable and productive!*
