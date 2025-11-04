const { MongoClient } = require('mongodb');

let dbConnection;
let client;

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('🔗 Attempting MongoDB connection...');
    
    // Simple connection options for Render
    const clientOptions = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };
    
    client = new MongoClient(uri, clientOptions);
    await client.connect();
    
    dbConnection = client.db();
    console.log('✅ Connected to MongoDB successfully');
    
    return dbConnection;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    throw error;
  }
};

const getDB = () => {
  if (!dbConnection) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return dbConnection;
};

module.exports = {
  connectDB,
  getDB
};