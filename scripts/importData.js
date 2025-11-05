const { MongoClient } = require('mongodb');
require('dotenv').config();

async function addTestData() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('contactsdb');
    const contacts = db.collection('contacts');

    // some test contacts to start with
    const testContacts = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        favoriteColor: 'Blue',
        birthday: new Date('1990-05-15')
      },
      {
        firstName: 'Jane',
        lastName: 'Smith', 
        email: 'jane.smith@example.com',
        favoriteColor: 'Green',
        birthday: new Date('1985-08-22')
      },
      {
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.johnson@example.com',
        favoriteColor: 'Red',
        birthday: new Date('1992-12-10')
      }
    ];

    const result = await contacts.insertMany(testContacts);
    console.log(`added ${result.insertedCount} contacts`);
    
  } catch (error) {
    console.error('error adding data:', error);
  } finally {
    await client.close();
  }
}

addTestData();