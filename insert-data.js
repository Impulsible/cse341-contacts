const { MongoClient } = require("mongodb");
require("dotenv").config();

async function importSampleData() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db();
    
    const sampleContacts = [
      {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        favoriteColor: "Blue",
        birthday: new Date("1990-05-15")
      },
      {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        favoriteColor: "Green",
        birthday: new Date("1985-08-22")
      },
      {
        firstName: "Bob",
        lastName: "Johnson",
        email: "bob.johnson@example.com",
        favoriteColor: "Red",
        birthday: new Date("1992-12-10")
      }
    ];
    
    // Clear existing contacts
    await db.collection("contacts").deleteMany({});
    
    // Insert new contacts
    const result = await db.collection("contacts").insertMany(sampleContacts);
    console.log("Successfully inserted " + result.insertedCount + " sample contacts");
    
    // Show what was inserted
    const contacts = await db.collection("contacts").find().toArray();
    console.log("Inserted contacts:");
    contacts.forEach(contact => {
      console.log("- " + contact.firstName + " " + contact.lastName + " (" + contact.email + ")");
    });
    
  } catch (error) {
    console.error("Error importing sample data:", error);
  } finally {
    await client.close();
  }
}

importSampleData();