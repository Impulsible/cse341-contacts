const { MongoClient } = require('mongodb');

let dbConnection;
let client;

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('MONGODB_URI is not defined');
    }

    console.log('Attempting MongoDB connection...');
    
    // Connection options for Render compatibility
    const clientOptions = {
      // SSL/TLS options
      tls: true,
      tlsAllowInvalidCertificates: true,
      tlsAllowInvalidHostnames: true,
      
      // Connection options
      retryWrites: true,
      w: 'majority',
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      
      // Use new URL parser and unified topology
      useNewUrlParser: true,
      useUnifiedTopology: true
    };

    client = new MongoClient(uri, clientOptions);
    
    await client.connect();
    dbConnection = client.db();
    
    // Test the connection
    await dbConnection.command({ ping: 1 });
    console.log('✅ Connected to MongoDB successfully');
    
    return dbConnection;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    console.log('URI used:', process.env.MONGODB_URI ? 'Present' : 'Missing');
    return null;
  }
};

const getDB = () => {
  if (!dbConnection) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return dbConnection;
};

// Close connection gracefully
const closeDB = async () => {
  if (client) {
    await client.close();
  }
};

module.exports = {
  connectDB,
  getDB,
  closeDB
};