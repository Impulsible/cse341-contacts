const { MongoClient } = require("mongodb");
require("dotenv").config();

async function seedData() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db();
    
    const contacts = [
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
    
    // clear out old data first
    await db.collection("contacts").deleteMany({});
    
    // add the new contacts
    const result = await db.collection("contacts").insertMany(contacts);
    console.log("added " + result.insertedCount + " contacts");
    
  } catch (error) {
    console.error("error seeding data:", error);
  } finally {
    await client.close();
  }
}

seedData();