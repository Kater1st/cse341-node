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
  // #swagger.tags = ['Contacts']
  // #swagger.description = 'Retrieve all contacts from the database'
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
  // #swagger.tags = ['Contacts']
  // #swagger.description = 'Retrieve a single contact by ID'
  try {
    const collection = await connect();
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

// POST a new contact
router.post('/', async (req, res) => {
  // #swagger.tags = ['Contacts']
  // #swagger.description = 'Create a new contact'
  // #swagger.parameters['body'] = {
  //   in: 'body',
  //   required: true,
  //   schema: {
  //     firstName: 'John',
  //     lastName: 'Doe',
  //     email: 'john@example.com',
  //     favoriteColor: 'Blue',
  //     birthday: '1990-01-01'
  //   }
  // }
  try {
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const collection = await connect();
    const contact = { firstName, lastName, email, favoriteColor, birthday };
    const result = await collection.insertOne(contact);
    res.status(201).json({ insertedId: result.insertedId });
  } catch (err) {
    console.error('POST error:', err);
    res.status(500).json({ error: 'Failed to create contact.' });
  }
});

// PUT update a contact by ID
router.put('/:id', async (req, res) => {
  // #swagger.tags = ['Contacts']
  // #swagger.description = 'Update an existing contact by ID'
  // #swagger.parameters['body'] = {
  //   in: 'body',
  //   required: true,
  //   schema: {
  //     firstName: 'Jane',
  //     lastName: 'Smith',
  //     email: 'jane@example.com',
  //     favoriteColor: 'Green',
  //     birthday: '1985-12-12'
  //   }
  // }
  try {
    const collection = await connect();
    const contactId = new ObjectId(req.params.id);
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    const result = await collection.updateOne(
      { _id: contactId },
      { $set: { firstName, lastName, email, favoriteColor, birthday } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Contact not found or unchanged.' });
    }

    res.status(204).send();
  } catch (err) {
    console.error('PUT error:', err);
    res.status(500).json({ error: 'Failed to update contact.' });
  }
});

// DELETE a contact by ID
router.delete('/:id', async (req, res) => {
  // #swagger.tags = ['Contacts']
  // #swagger.description = 'Delete a contact by ID'
  try {
    const collection = await connect();
    const contactId = new ObjectId(req.params.id);

    const result = await collection.deleteOne({ _id: contactId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    res.status(200).json({ message: 'Contact deleted successfully.' });
  } catch (err) {
    console.error('DELETE error:', err);
    res.status(500).json({ error: 'Failed to delete contact.' });
  }
});

module.exports = router;
