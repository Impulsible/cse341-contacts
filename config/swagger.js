const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CSE 341 Contacts API',
      version: '1.0.0',
      description: 'A complete REST API for managing contacts with full CRUD operations',
      contact: {
        name: 'API Support',
        url: 'https://github.com/Impulsible/cse341-contacts'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
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
    tags: [
      {
        name: 'Contacts',
        description: 'Contact management endpoints'
      }
    ],
    paths: {
      '/contacts': {
        get: {
          tags: ['Contacts'],
          summary: 'Get all contacts',
          description: 'Retrieve a list of all contacts',
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Contact'
                    }
                  }
                }
              }
            },
            500: {
              description: 'Server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ['Contacts'],
          summary: 'Create a new contact',
          description: 'Create a new contact with all required fields',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Contact'
                }
              }
            }
          },
          responses: {
            201: {
              description: 'Contact created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                        description: 'ID of the newly created contact',
                        example: '507f1f77bcf86cd799439011'
                      }
                    }
                  }
                }
              }
            },
            400: {
              description: 'Bad request - missing required fields',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            500: {
              description: 'Server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        }
      },
      '/contacts/{id}': {
        get: {
          tags: ['Contacts'],
          summary: 'Get contact by ID',
          description: 'Retrieve a specific contact by its ID',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'Contact ID',
              schema: {
                type: 'string'
              }
            }
          ],
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Contact'
                  }
                }
              }
            },
            404: {
              description: 'Contact not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            500: {
              description: 'Server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        },
        put: {
          tags: ['Contacts'],
          summary: 'Update contact by ID',
          description: 'Update an existing contact',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'Contact ID',
              schema: {
                type: 'string'
              }
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Contact'
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Contact updated successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Contact'
                  }
                }
              }
            },
            400: {
              description: 'Bad request',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            404: {
              description: 'Contact not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            500: {
              description: 'Server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        },
        delete: {
          tags: ['Contacts'],
          summary: 'Delete contact by ID',
          description: 'Delete a specific contact by its ID',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'Contact ID',
              schema: {
                type: 'string'
              }
            }
          ],
          responses: {
            200: {
              description: 'Contact deleted successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        example: 'Contact deleted successfully'
                      }
                    }
                  }
                }
              }
            },
            404: {
              description: 'Contact not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            500: {
              description: 'Server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        }
      }
    },
    components: {
      schemas: {
        Contact: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated contact ID',
              example: '507f1f77bcf86cd799439011'
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
              description: 'Birthday in YYYY-MM-DD format',
              example: '1990-05-15'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
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
              example: 'Error description'
            },
            error: {
              type: 'string',
              example: 'Detailed error message'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'], // Path to API routes
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi
};