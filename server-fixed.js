const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3000;

// Hardcoded MongoDB URI
const MONGODB_URI = 'mongodb+srv://henryosuagwu22_db_user:Supreme101@impulsible.3xejf8t.mongodb.net/contactsdb?retryWrites=true&w=majority';

// Middleware
app.use(cors());
app.use(express.json());

let db;

// Connect to MongoDB
async function connectDB() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db();
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.log('❌ MongoDB connection failed:', error.message);
    db = null;
  }
}

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'CSE 341 Contacts API - Working!',
    description: 'API for managing contacts',
    version: '1.0.0',
    endpoints: {
      getAllContacts: 'GET /contacts',
      getContactById: 'GET /contacts/:id'
    }
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: db ? 'Connected' : 'Not connected'
  });
});

// GET all contacts
app.get('/contacts', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({
        success: false,
        message: 'Database not connected'
      });
    }

    const contacts = await db.collection('contacts').find().toArray();
    
    res.json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts',
      error: error.message
    });
  }
});

// GET single contact by ID
app.get('/contacts/:id', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({
        success: false,
        message: 'Database not connected'
      });
    }

    const { ObjectId } = require('mongodb');
    const contactId = req.params.id;
    
    // Validate if ID is a valid ObjectId
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

// FIXED: 404 handler - put this LAST and use a function
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found: ' + req.method + ' ' + req.originalUrl
  });
});

// Start server and connect to DB
app.listen(PORT, async () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  await connectDB();
});

module.exports = app;