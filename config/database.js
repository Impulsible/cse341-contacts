const { MongoClient } = require('mongodb');

let dbConnection;
let client;

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('MONGODB_URI missing from .env file');
    }

    console.log('Connecting to MongoDB...');
    
    const clientOptions = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };
    
    client = new MongoClient(uri, clientOptions);
    await client.connect();
    
    await client.db().admin().ping();
    
    dbConnection = client.db();
    console.log('MongoDB connected');
    
    return dbConnection;
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    throw error;
  }
};

const getDB = () => {
  if (!dbConnection) {
    throw new Error('Database not connected yet');
  }
  return dbConnection;
};

module.exports = {
  connectDB,
  getDB
};