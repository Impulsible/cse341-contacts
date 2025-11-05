const express = require('express');
const cors = require('cors');
const { connectDB, getDB } = require('./config/database');
const { specs, swaggerUi } = require('./config/swagger');

// Load environment variables
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Global variable to track DB connection
let dbConnected = false;

// Connect to MongoDB
async function initializeDatabase() {
  try {
    if (!process.env.MONGODB_URI) {
      console.log('⚠️  MONGODB_URI not found - running without database');
      return;
    }

    console.log('🔗 Attempting MongoDB connection...');
    await connectDB();
    dbConnected = true;
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.log('❌ MongoDB connection failed:', error.message);
    dbConnected = false;
  }
}

// Start database connection
initializeDatabase();

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

// Routes
app.use('/contacts', require('./routes/contacts'));

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'CSE 341 Contacts API - Hello World!',
    description: 'API for managing contacts',
    version: '1.0.0',
    endpoints: {
      getAllContacts: 'GET /contacts',
      getContactById: 'GET /contacts/:id',
      createContact: 'POST /contacts',
      updateContact: 'PUT /contacts/:id',
      deleteContact: 'DELETE /contacts/:id',
      apiDocs: 'GET /api-docs'
    },
    database: dbConnected ? 'Connected' : 'Not connected',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: dbConnected ? 'Connected' : 'Not connected'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
  console.log(`🗄️  Database: ${dbConnected ? 'Connected' : 'Connecting...'}`);
});

module.exports = app;