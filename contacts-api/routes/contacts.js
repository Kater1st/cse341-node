require('dotenv').config();

const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');

// MongoDB connection setup
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = "contactsDB";

// Cache the collection to avoid reconnecting on each request
let collection;

async function connect() {
  if (!collection) {
    await client.connect();
    collection = client.db(dbName).collection('contacts');
  }
  return collection;
}

// GET all contacts
router.get('/', async (req, res) => {
  try {
    const collection = await connect();
    const contacts = await collection.find().toArray();
    res.json(contacts);
  } catch (error) {
    console.error("Error getting all contacts:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

// GET contact by ID
router.get('/:id', async (req, res) => {
  try {
    const collection = await connect();
    
    // Safely create ObjectId
    let id;
    try {
      id = new ObjectId(req.params.id);
    } catch (err) {
      return res.status(400).send("Invalid ID format");
    }

    const contact = await collection.findOne({ _id: id });
    if (contact) {
      res.json(contact);
    } else {
      res.status(404).send("Contact not found");
    }
  } catch (error) {
    console.error("Error getting contact by ID:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
