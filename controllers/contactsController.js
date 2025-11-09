const { ObjectId } = require('mongodb');
const { getDB } = require('../config/database');

// GET all contacts
const getAllContacts = async (req, res) => {
  try {
    const db = getDB();
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
};

// GET single contact by ID
const getContactById = async (req, res) => {
  try {
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
};

// POST - Create new contact
const createContact = async (req, res) => {
  try {
    const db = getDB();
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: firstName, lastName, email, favoriteColor, birthday'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    const newContact = {
      firstName,
      lastName,
      email,
      favoriteColor,
      birthday: new Date(birthday),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('contacts').insertOne(newContact);

    res.status(201).json({
      success: true,
      message: 'Contact created successfully',
      id: result.insertedId,
      data: newContact
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating contact',
      error: error.message
    });
  }
};

// PUT - Update contact
const updateContact = async (req, res) => {
  try {
    const db = getDB();
    const contactId = req.params.id;
    
    if (!ObjectId.isValid(contactId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact ID format'
      });
    }

    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    // Check if contact exists
    const existingContact = await db.collection('contacts').findOne({ 
      _id: new ObjectId(contactId) 
    });

    if (!existingContact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    const updateData = {
      updatedAt: new Date()
    };

    // Only update fields that are provided
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }
      updateData.email = email;
    }
    if (favoriteColor) updateData.favoriteColor = favoriteColor;
    if (birthday) updateData.birthday = new Date(birthday);

    const result = await db.collection('contacts').updateOne(
      { _id: new ObjectId(contactId) },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({
        success: false,
        message: 'No changes made to contact'
      });
    }

    res.json({
      success: true,
      message: 'Contact updated successfully',
      id: contactId
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating contact',
      error: error.message
    });
  }
};

// DELETE - Delete contact
const deleteContact = async (req, res) => {
  try {
    const db = getDB();
    const contactId = req.params.id;
    
    if (!ObjectId.isValid(contactId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact ID format'
      });
    }

    const result = await db.collection('contacts').deleteOne({ 
      _id: new ObjectId(contactId) 
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully',
      id: contactId
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting contact',
      error: error.message
    });
  }
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
};