const { MongoClient } = require('mongodb');

let dbConnection;
let client;

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // Add MongoDB connection options for SSL
    const clientOptions = {
      // These options help with SSL/TLS issues
      tls: true,
      tlsAllowInvalidCertificates: false,
      retryWrites: true,
      w: 'majority'
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