const express = require('express');
const cors = require('cors');
const { connectDB, getDB } = require('./config/database');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let dbConnected = false;

async function startDB() {
  try {
    if (!process.env.MONGODB_URI) {
      console.log('no mongodb uri found');
      dbConnected = false;
      return;
    }

    console.log('connecting to mongodb...');
    await connectDB();
    dbConnected = true;
    console.log('mongodb connected');
  } catch (error) {
    console.log('mongodb connection failed:', error.message);
    dbConnected = false;
  }
}

startDB();

app.get('/', (req, res) => {
  res.json({ 
    message: 'contacts api',
    database: dbConnected ? 'connected' : 'not connected'
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    database: dbConnected ? 'connected' : 'not connected'
  });
});

app.get('/contacts', async (req, res) => {
  try {
    if (!dbConnected) {
      return res.status(500).json({ error: 'database not connected' });
    }

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
});

app.get('/contacts/:id', async (req, res) => {
  try {
    if (!dbConnected) {
      return res.status(500).json({ error: 'database not connected' });
    }

    const { ObjectId } = require('mongodb');
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
});

app.use((req, res) => {
  res.status(404).json({ error: 'not found' });
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});