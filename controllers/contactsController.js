const { ObjectId } = require('mongodb');
const { getDB } = require('../config/database');

// get all contacts
const getAllContacts = async (req, res) => {
  try {
    const db = getDB();
    const contacts = await db.collection('contacts').find().toArray();
    
    res.json({
      data: contacts,
      count: contacts.length
    });
  } catch (error) {
    console.error('error getting contacts:', error);
    res.status(500).json({ error: 'something went wrong' });
  }
};

// get one contact
const getContactById = async (req, res) => {
  try {
    const db = getDB();
    const contactId = req.params.id;
    
    if (!ObjectId.isValid(contactId)) {
      return res.status(400).json({ error: 'bad id format' });
    }

    const contact = await db.collection('contacts').findOne({ 
      _id: new ObjectId(contactId) 
    });

    if (!contact) {
      return res.status(404).json({ error: 'contact not found' });
    }

    res.json(contact);
  } catch (error) {
    console.error('error getting contact:', error);
    res.status(500).json({ error: 'server error' });
  }
};

// create new contact
const createContact = async (req, res) => {
  try {
    const db = getDB();
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: 'missing required fields' });
    }

    // quick email check
    if (!email.includes('@')) {
      return res.status(400).json({ error: 'invalid email' });
    }

    const newContact = {
      firstName,
      lastName,
      email,
      favoriteColor,
      birthday: birthday ? new Date(birthday) : null,
      createdAt: new Date()
    };

    const result = await db.collection('contacts').insertOne(newContact);

    res.status(201).json({
      id: result.insertedId,
      ...newContact
    });
  } catch (error) {
    console.error('error creating contact:', error);
    res.status(500).json({ error: 'failed to create contact' });
  }
};

// update contact
const updateContact = async (req, res) => {
  try {
    const db = getDB();
    const contactId = req.params.id;
    
    if (!ObjectId.isValid(contactId)) {
      return res.status(400).json({ error: 'bad id format' });
    }

    const existing = await db.collection('contacts').findOne({ 
      _id: new ObjectId(contactId) 
    });

    if (!existing) {
      return res.status(404).json({ error: 'contact not found' });
    }

    const updates = {};
    if (req.body.firstName) updates.firstName = req.body.firstName;
    if (req.body.lastName) updates.lastName = req.body.lastName;
    if (req.body.email) {
      if (!req.body.email.includes('@')) {
        return res.status(400).json({ error: 'invalid email' });
      }
      updates.email = req.body.email;
    }
    if (req.body.favoriteColor) updates.favoriteColor = req.body.favoriteColor;
    if (req.body.birthday) updates.birthday = new Date(req.body.birthday);
    
    updates.updatedAt = new Date();

    await db.collection('contacts').updateOne(
      { _id: new ObjectId(contactId) },
      { $set: updates }
    );

    res.json({ message: 'contact updated', id: contactId });
  } catch (error) {
    console.error('error updating contact:', error);
    res.status(500).json({ error: 'update failed' });
  }
};

// delete contact
const deleteContact = async (req, res) => {
  try {
    const db = getDB();
    const contactId = req.params.id;
    
    if (!ObjectId.isValid(contactId)) {
      return res.status(400).json({ error: 'bad id format' });
    }

    const result = await db.collection('contacts').deleteOne({ 
      _id: new ObjectId(contactId) 
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'contact not found' });
    }

    res.json({ message: 'contact deleted' });
  } catch (error) {
    console.error('error deleting contact:', error);
    res.status(500).json({ error: 'delete failed' });
  }
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
};