const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Swagger configuration
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CSE 341 Contacts API',
      version: '1.0.0',
      description: 'A complete REST API for managing contacts with full CRUD operations',
      contact: {
        name: 'API Support',
        url: 'https://github.com/your-username/cse341-contacts'
      },
    },
    servers: [
      {
        url: process.env.RENDER_URL || 'http://localhost:3000',
        description: 'Production server'
      },
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

// Routes
app.use('/contacts', require('./routes/contacts'));

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'CSE 341 Contacts API',
    documentation: '/api-docs',
    endpoints: '/contacts'
  });
});

// Error handling for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
});