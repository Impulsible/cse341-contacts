const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contactsController');

// get all contacts
router.get('/', contactsController.getAllContacts);

// get one contact by id
router.get('/:id', contactsController.getContactById);

// create new contact
router.post('/', contactsController.createContact);

// update contact
router.put('/:id', contactsController.updateContact);

// delete contact
router.delete('/:id', contactsController.deleteContact);

module.exports = router;