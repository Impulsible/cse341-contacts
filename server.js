const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./config/database');
require('dotenv').config();

// Connect to MongoDB
connectDB();

const app = express();

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
    },
    servers: [
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

// Root route - Updated to match your desired response
app.get('/', (req, res) => {
  res.json({
    message: "CSE 341 Contacts API - Hello World!",
    description: "Complete REST API for contact management",
    version: "2.0.0",
    endpoints: {
      getAllContacts: "GET /contacts",
      getContactById: "GET /contacts/:id",
      createContact: "POST /contacts",
      updateContact: "PUT /contacts/:id",
      deleteContact: "DELETE /contacts/:id",
      apiDocs: "GET /api-docs"
    },
    database: "Connected",
    environment: "development"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Docs: http://localhost:${PORT}/api-docs`);
});