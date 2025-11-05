const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// swagger config 
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Contacts API',
      version: '1.0.0',
      description: 'API for contacts project',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'local dev'
      }
    ]
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

  app.get('/docs.json', (req, res) => {
    res.json(specs);
  });

  console.log('docs at http://localhost:3000/api-docs');
};

module.exports = swaggerDocs;