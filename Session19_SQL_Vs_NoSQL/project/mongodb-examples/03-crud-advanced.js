/**
 * 03 - Advanced CRUD Operations
 * 
 * Demonstrates complex queries, embedded documents, and real-world scenarios
 * Run: npm run crud-advanced
 */

require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function runAdvancedCRUD() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas\n');
    
    const db = client.db(process.env.DB_NAME || 'session19_practice');
    const productsCollection = db.collection('products');
    const ordersCollection = db.collection('orders');
    
    console.log('🚀 ADVANCED CRUD OPERATIONS\n');
    console.log('═'.repeat(60));
    
    // ========================================
    // WORKING WITH EMBEDDED DOCUMENTS
    // ========================================
    console.log('\n📦 EMBEDDED DOCUMENTS\n');
    console.log('─'.repeat(60));
    
    // Insert products with embedded reviews
    console.log('\n1️⃣ Creating Products with Embedded Reviews:');
    
    const products = [
      {
        name: 'Wireless Mouse',
        price: 29.99,
        category: 'Electronics',
        stock: 150,
        specs: {
          brand: 'LogiTech',
          color: 'Black',
          wireless: true,
          dpi: 1600
        },
        reviews: [
          { user: 'John', rating: 5, comment: 'Excellent product!' },
          { user: 'Jane', rating: 4, comment: 'Good value for money' }
        ],
        tags: ['wireless', 'computer', 'accessories'],
        createdAt: new Date()
      },
      {
        name: 'USB-C Cable',
        price: 19.99,
        category: 'Electronics',
        stock: 300,
        specs: {
          brand: 'Anker',
          length: '2m',
          fastCharging: true,
          dataTransfer: true
        },
        reviews: [
          { user: 'Bob', rating: 5, comment: 'Durable and fast!' }
        ],
        tags: ['cable', 'usb-c', 'charging'],
        createdAt: new Date()
      },
      {
        name: 'Laptop Stand',
        price: 79.99,
        category: 'Accessories',
        stock: 75,
        specs: {
          brand: 'ErgoTech',
          material: 'Aluminum',
          adjustable: true,
          maxWeight: '5kg'
        },
        reviews: [
          { user: 'Alice', rating: 4, comment: 'Sturdy and well-made' },
          { user: 'Charlie', rating: 3, comment: 'Good but a bit pricey' }
        ],
        tags: ['laptop', 'desk', 'ergonomic'],
        createdAt: new Date()
      }
    ];
    
    const insertResult = await productsCollection.insertMany(products);
    console.log(`   ✅ Inserted ${insertResult.insertedCount} products`);
    
    // Query embedded documents
    console.log('\n2️⃣ Query Embedded Document (specs.wireless = true):');
    const wirelessProducts = await productsCollection.find({
      'specs.wireless': true
    }).toArray();
    console.log(`   📊 Found ${wirelessProducts.length} wireless product(s):`);
    wirelessProducts.forEach(p => {
      console.log(`   - ${p.name} ($${p.price})`);
    });
    
    // Query array elements
    console.log('\n3️⃣ Query Array (products with "laptop" tag):');
    const laptopItems = await productsCollection.find({
      tags: 'laptop'
    }).toArray();
    console.log(`   📊 Found ${laptopItems.length} laptop-related item(s):`);
    laptopItems.forEach(p => {
      console.log(`   - ${p.name}: [${p.tags.join(', ')}]`);
    });
    
    // Query embedded arrays
    console.log('\n4️⃣ Query Embedded Array (reviews with rating >= 5):');
    const topRatedProducts = await productsCollection.find({
      'reviews.rating': { $gte: 5 }
    }).toArray();
    console.log(`   📊 Found ${topRatedProducts.length} top-rated product(s):`);
    topRatedProducts.forEach(p => {
      const fiveStarReviews = p.reviews.filter(r => r.rating >= 5);
      console.log(`   - ${p.name}: ${fiveStarReviews.length} five-star review(s)`);
    });
    
    // ========================================
    // COMPLEX UPDATE OPERATIONS
    // ========================================
    console.log('\n\n✏️  COMPLEX UPDATES\n');
    console.log('─'.repeat(60));
    
    // Add review to existing product
    console.log('\n1️⃣ Add New Review to Product:');
    await productsCollection.updateOne(
      { name: 'Wireless Mouse' },
      {
        $push: {
          reviews: {
            user: 'Sarah',
            rating: 5,
            comment: 'Best mouse I ever used!',
            date: new Date()
          }
        }
      }
    );
    const mouseAfter = await productsCollection.findOne({ name: 'Wireless Mouse' });
    console.log(`   ✅ Now has ${mouseAfter.reviews.length} reviews`);
    
    // Update nested field
    console.log('\n2️⃣ Update Nested Field (specs.dpi):');
    await productsCollection.updateOne(
      { name: 'Wireless Mouse' },
      { $set: { 'specs.dpi': 3200 } }
    );
    const updatedMouse = await productsCollection.findOne({ name: 'Wireless Mouse' });
    console.log(`   ✅ New DPI: ${updatedMouse.specs.dpi}`);
    
    // Update multiple fields with operators
    console.log('\n3️⃣ Bulk Price Update (10% discount on Electronics):');
    const discountResult = await productsCollection.updateMany(
      { category: 'Electronics' },
      {
        $mul: { price: 0.9 },  // Multiply price by 0.9 (10% off)
        $set: { onSale: true, saleDate: new Date() }
      }
    );
    console.log(`   ✅ Updated ${discountResult.modifiedCount} product(s)`);
    
    const saleProducts = await productsCollection.find({ onSale: true }).toArray();
    console.log('   📊 Products on sale:');
    saleProducts.forEach(p => {
      console.log(`   - ${p.name}: $${p.price.toFixed(2)} (was $${(p.price / 0.9).toFixed(2)})`);
    });
    
    // ========================================
    // WORKING WITH REFERENCES
    // ========================================
    console.log('\n\n🔗 REFERENCED DOCUMENTS\n');
    console.log('─'.repeat(60));
    
    // Get product IDs for orders
    const mouse = await productsCollection.findOne({ name: 'Wireless Mouse' });
    const cable = await productsCollection.findOne({ name: 'USB-C Cable' });
    
    // Create orders with product references
    console.log('\n1️⃣ Creating Orders with Product References:');
    
    const orders = [
      {
        orderNumber: 'ORD-001',
        customer: {
          name: 'John Doe',
          email: 'john@email.com',
          address: '123 Main St, Chennai'
        },
        items: [
          {
            productId: mouse._id,
            productName: mouse.name,  // Denormalized for quick access
            quantity: 2,
            price: mouse.price
          },
          {
            productId: cable._id,
            productName: cable.name,
            quantity: 1,
            price: cable.price
          }
        ],
        total: (mouse.price * 2) + cable.price,
        status: 'processing',
        orderDate: new Date()
      },
      {
        orderNumber: 'ORD-002',
        customer: {
          name: 'Jane Smith',
          email: 'jane@email.com',
          address: '456 Park Ave, Mumbai'
        },
        items: [
          {
            productId: cable._id,
            productName: cable.name,
            quantity: 3,
            price: cable.price
          }
        ],
        total: cable.price * 3,
        status: 'shipped',
        orderDate: new Date(Date.now() - 86400000) // 1 day ago
      }
    ];
    
    const orderInsertResult = await ordersCollection.insertMany(orders);
    console.log(`   ✅ Created ${orderInsertResult.insertedCount} orders`);
    
    // Query orders and populate product details
    console.log('\n2️⃣ Finding Orders with Product Details:');
    const allOrders = await ordersCollection.find({}).toArray();
    
    for (const order of allOrders) {
      console.log(`\n   📦 Order ${order.orderNumber}:`);
      console.log(`   👤 Customer: ${order.customer.name}`);
      console.log(`   📍 Status: ${order.status}`);
      console.log(`   🛒 Items:`);
      
      for (const item of order.items) {
        // Fetch full product details (this is like a JOIN in SQL)
        const product = await productsCollection.findOne({ _id: item.productId });
        console.log(`      - ${item.productName} x${item.quantity} @ $${item.price} = $${(item.quantity * item.price).toFixed(2)}`);
        console.log(`        Stock available: ${product.stock}`);
      }
      
      console.log(`   💰 Total: $${order.total.toFixed(2)}`);
    }
    
    // ========================================
    // AGGREGATION PIPELINE (Preview)
    // ========================================
    console.log('\n\n📊 SIMPLE AGGREGATION\n');
    console.log('─'.repeat(60));
    
    // Calculate average price by category
    console.log('\n1️⃣ Average Price by Category:');
    const avgPriceByCategory = await productsCollection.aggregate([
      {
        $group: {
          _id: '$category',
          avgPrice: { $avg: '$price' },
          count: { $sum: 1 },
          totalStock: { $sum: '$stock' }
        }
      }
    ]).toArray();
    
    avgPriceByCategory.forEach(cat => {
      console.log(`   📁 ${cat._id}:`);
      console.log(`      Average Price: $${cat.avgPrice.toFixed(2)}`);
      console.log(`      Products: ${cat.count}`);
      console.log(`      Total Stock: ${cat.totalStock}`);
    });
    
    // Count reviews
    console.log('\n2️⃣ Products with Most Reviews:');
    const productsByReviews = await productsCollection.aggregate([
      {
        $project: {
          name: 1,
          reviewCount: { $size: '$reviews' },
          avgRating: { $avg: '$reviews.rating' }
        }
      },
      { $sort: { reviewCount: -1 } }
    ]).toArray();
    
    productsByReviews.forEach(p => {
      console.log(`   - ${p.name}: ${p.reviewCount} reviews, Avg: ${p.avgRating.toFixed(1)}⭐`);
    });
    
    // ========================================
    // USEFUL PATTERNS
    // ========================================
    console.log('\n\n💡 USEFUL PATTERNS\n');
    console.log('─'.repeat(60));
    
    // Upsert (Update or Insert)
    console.log('\n1️⃣ Upsert Example (create if not exists):');
    const upsertResult = await productsCollection.updateOne(
      { name: 'Keyboard' },  // Filter
      {
        $set: {
          name: 'Keyboard',
          price: 49.99,
          category: 'Electronics',
          stock: 100
        }
      },
      { upsert: true }  // Create if not exists
    );
    
    if (upsertResult.upsertedCount > 0) {
      console.log(`   ✅ Created new product with ID: ${upsertResult.upsertedId}`);
    } else {
      console.log(`   ✅ Updated existing product`);
    }
    
    // Bulk Write Operations
    console.log('\n2️⃣ Bulk Write (multiple operations at once):');
    const bulkResult = await productsCollection.bulkWrite([
      {
        insertOne: {
          document: {
            name: 'Monitor',
            price: 299.99,
            category: 'Electronics',
            stock: 50,
            createdAt: new Date()
          }
        }
      },
      {
        updateOne: {
          filter: { name: 'Wireless Mouse' },
          update: { $inc: { stock: -10 } }  // Reduce stock
        }
      },
      {
        deleteOne: {
          filter: { name: 'Keyboard' }
        }
      }
    ]);
    
    console.log(`   ✅ Inserted: ${bulkResult.insertedCount}`);
    console.log(`   ✅ Updated: ${bulkResult.modifiedCount}`);
    console.log(`   ✅ Deleted: ${bulkResult.deletedCount}`);
    
    // ========================================
    // FINAL SUMMARY
    // ========================================
    console.log('\n\n📊 FINAL DATABASE SUMMARY\n');
    console.log('─'.repeat(60));
    
    const productCount = await productsCollection.countDocuments();
    const orderCount = await ordersCollection.countDocuments();
    
    console.log(`   Products in database: ${productCount}`);
    console.log(`   Orders in database: ${orderCount}`);
    
    // Clean up
    console.log('\n🧹 Cleaning up test data...');
    // await productsCollection.deleteMany({});
    // await ordersCollection.deleteMany({});
    console.log('   ✅ All test data removed\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await client.close();
    console.log('🔌 Connection closed\n');
  }
}

// Run the operations
runAdvancedCRUD().catch(console.error);
