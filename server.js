const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');

// Hardcode environment variables to avoid .env issues
process.env.MONGODB_URI = 'mongodb+srv://henryosuagwu22_db_user:Supreme101@impulsible.3xejf8t.mongodb.net/contactsdb?retryWrites=true&w=majority';
process.env.PORT = '3000';
process.env.NODE_ENV = 'development';

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

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
      getContactById: 'GET /contacts/:id'
    }
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// FIXED: 404 handler - use function instead of '*'
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
});

module.exports = app;