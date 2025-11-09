const Contact = require('../models/contact');

// @desc    Get all contacts
// @route   GET /contacts
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single contact by ID
// @route   GET /contacts/:id
const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
        error: 'The requested contact was not found in the database'
      });
    }
    
    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact ID',
        error: 'The provided ID format is invalid'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create new contact
// @route   POST /contacts
const createContact = async (req, res) => {
  try {
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;
    
    // Check if all required fields are provided
    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
      return res.status(400).json({
        success: false,
        message: 'Bad request - missing required fields',
        error: 'All fields (firstName, lastName, email, favoriteColor, birthday) are required'
      });
    }
    
    // Create new contact
    const contact = new Contact({
      firstName,
      lastName,
      email,
      favoriteColor,
      birthday
    });

    const savedContact = await contact.save();
    
    res.status(201).json({
      success: true,
      id: savedContact._id,
      message: 'Contact created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Bad request - missing required fields',
      error: error.message
    });
  }
};

// @desc    Update contact
// @route   PUT /contacts/:id
const updateContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
        error: 'The requested contact was not found in the database'
      });
    }
    
    // Update fields that are provided
    if (req.body.firstName !== undefined) contact.firstName = req.body.firstName;
    if (req.body.lastName !== undefined) contact.lastName = req.body.lastName;
    if (req.body.email !== undefined) contact.email = req.body.email;
    if (req.body.favoriteColor !== undefined) contact.favoriteColor = req.body.favoriteColor;
    if (req.body.birthday !== undefined) contact.birthday = req.body.birthday;

    const updatedContact = await contact.save();
    
    res.status(200).json({
      success: true,
      data: updatedContact,
      message: 'Contact updated successfully'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Bad request',
        error: 'Invalid contact ID format'
      });
    }
    
    res.status(400).json({
      success: false,
      message: 'Bad request',
      error: error.message
    });
  }
};

// @desc    Delete contact
// @route   DELETE /contacts/:id
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
        error: 'The requested contact was not found in the database'
      });
    }
    
    await Contact.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Bad request',
        error: 'Invalid contact ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
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