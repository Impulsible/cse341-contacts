const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contactsController');

// GET all contacts
router.get('/', contactsController.getAllContacts);

// GET single contact by ID
router.get('/:id', contactsController.getContactById);

module.exports = router;