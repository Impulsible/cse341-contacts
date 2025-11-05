const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CSE 341 Contacts API',
      version: '1.0.0',
      description: 'A REST API for managing contacts',
      contact: {
        name: 'API Support',
        email: 'your-email@example.com'
      }
    },
    servers: [
      {
        url: 'https://cse341-contacts-acjx.onrender.com',
        description: 'Production server'
      },
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        Contact: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated contact ID'
            },
            firstName: {
              type: 'string',
              description: 'First name of the contact',
              example: 'John'
            },
            lastName: {
              type: 'string',
              description: 'Last name of the contact',
              example: 'Doe'
            },
            email: {
              type: 'string',
              description: 'Email address of the contact',
              example: 'john.doe@example.com'
            },
            favoriteColor: {
              type: 'string',
              description: 'Favorite color of the contact',
              example: 'Blue'
            },
            birthday: {
              type: 'string',
              format: 'date',
              description: 'Birthday of the contact (YYYY-MM-DD)',
              example: '1990-05-15'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date when contact was created'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date when contact was last updated'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error message description'
            },
            error: {
              type: 'string',
              example: 'Detailed error information'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'] // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi
};