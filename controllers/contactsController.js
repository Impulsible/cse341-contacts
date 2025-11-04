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
      message: 'Database connection error',
      error: error.message
    });
  }
};

// GET single contact by ID
const getContactById = async (req, res) => {
  try {
    const db = getDB();
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
      message: 'Database connection error',
      error: error.message
    });
  }
};

module.exports = {
  getAllContacts,
  getContactById
};