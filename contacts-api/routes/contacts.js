require('dotenv').config(); // Add this line at the top

const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = "contactsDB";

async function connect() {
  if (!client.topology?.isConnected()) {
    await client.connect();
  }
  return client.db(dbName).collection('contacts');
}

// GET all contacts
router.get('/', async (req, res) => {
  const collection = await connect();
  const contacts = await collection.find().toArray();
  res.json(contacts);
});

// GET contact by ID
router.get('/:id', async (req, res) => {
  const collection = await connect();
  const id = new ObjectId(req.params.id);
  const contact = await collection.findOne({ _id: id });
  contact ? res.json(contact) : res.status(404).send("Contact not found");
});

module.exports = router;
