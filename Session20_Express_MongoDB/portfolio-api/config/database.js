/**
 * MongoDB Database Connection Configuration
 * 
 * This module handles the connection to MongoDB using Mongoose ODM.
 * It supports both local MongoDB and MongoDB Atlas (cloud).
 * 
 * Features:
 * - Async connection with error handling
 * - Connection pooling
 * - Automatic reconnection
 * - Graceful shutdown handling
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Connect to MongoDB database
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    // Connection options for better performance and reliability
    const options = {
      // Remove deprecated options (no longer needed in Mongoose 6+)
      // Connection pool settings
      maxPoolSize: 10,
      minPoolSize: 5,
      
      // Timeout settings
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      
      // Connection settings
      family: 4 // Use IPv4, skip trying IPv6
    };

    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URI, options);

    // Log successful connection
    console.log(`\n✅ MongoDB Connected Successfully!`);
    console.log(`   • Host: ${conn.connection.host}`);
    console.log(`   • Database: ${conn.connection.name}`);
    console.log(`   • Port: ${conn.connection.port}\n`);

    // Handle connection events
    mongoose.connection.on('connected', () => {
      console.log('📡 Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error(`❌ Mongoose connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('📴 Mongoose disconnected from MongoDB');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('\n👋 MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('\n❌ MongoDB Connection Error:');
    console.error(`   • Message: ${error.message}`);
    
    // Provide helpful error messages
    if (error.message.includes('ECONNREFUSED')) {
      console.error('   • Tip: Make sure MongoDB is running locally');
      console.error('   • Or check your MongoDB Atlas connection string');
    } else if (error.message.includes('authentication failed')) {
      console.error('   • Tip: Check your username and password in MONGO_URI');
    } else if (error.message.includes('bad auth')) {
      console.error('   • Tip: Verify your database user credentials');
    }
    
    console.error('\n');
    
    // Exit with failure
    process.exit(1);
  }
};

/**
 * Close database connection
 * @returns {Promise<void>}
 */
export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error.message);
    throw error;
  }
};

/**
 * Get connection status
 * @returns {string} Connection state
 */
export const getConnectionStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  return states[mongoose.connection.readyState] || 'unknown';
};

export default connectDB;
