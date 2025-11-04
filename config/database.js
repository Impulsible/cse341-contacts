const { MongoClient } = require('mongodb');

let dbConnection;
let client;

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('MONGODB_URI is not defined');
    }

    client = new MongoClient(uri);
    await client.connect();
    dbConnection = client.db();
    console.log('✅ Connected to MongoDB successfully');
    
    return dbConnection;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    return null;
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