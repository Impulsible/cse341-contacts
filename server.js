const express = require('express');
const cors = require('cors');
const { connectDB, getDB } = require('./config/database');

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
    // Check if MongoDB URI is available
    if (!process.env.MONGODB_URI) {
      console.log('❌ MONGODB_URI not found in environment variables');
      dbConnected = false;
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

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'CSE 341 Contacts API - Hello World!',
    description: 'API for managing contacts',
    version: '1.0.0',
    endpoints: {
      getAllContacts: 'GET /contacts',
      getContactById: 'GET /contacts/:id'
    },
    database: dbConnected ? 'Connected' : 'Not connected',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: dbConnected ? 'Connected' : 'Not connected'
  });
});

// GET all contacts
app.get('/contacts', async (req, res) => {
  try {
    if (!dbConnected) {
      return res.status(500).json({
        success: false,
        message: 'Database not connected',
        databaseStatus: 'Not connected'
      });
    }

    const db = getDB();
    const contacts = await db.collection('contacts').find().toArray();
    
    res.json({
      success: true,
      count: contacts.length,
      data: contacts,
      databaseStatus: 'Connected'
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts',
      error: error.message,
      databaseStatus: 'Error'
    });
  }
});

// GET single contact by ID
app.get('/contacts/:id', async (req, res) => {
  try {
    if (!dbConnected) {
      return res.status(500).json({
        success: false,
        message: 'Database not connected'
      });
    }

    const { ObjectId } = require('mongodb');
    const db = getDB();
    const contactId = req.params.id;
    
    if (!ObjectId.isValid(contactId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact ID format'
      });
    }

    const contact = await db.collection('contacts').findOne({ 
      _id: new ObjectId(contactId) 
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact',
      error: error.message
    });
  }
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
  console.log(`🗄️  Database: ${dbConnected ? 'Connected' : 'Connecting...'}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;