const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/peopleDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Person Schema
const personSchema = new mongoose.Schema({
    name: String,
    age: Number,
    gender: String,
    mobile: String
});

const Person = mongoose.model('Person', personSchema);

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(express.static('public'));

// Get all people
app.get('/person', async (req, res) => {
    try {
        const people = await Person.find();
        res.json(people);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch people' });
    }
});

// Create a new person
app.post('/person', async (req, res) => {
    try {
        const newPerson = new Person(req.body);
        await newPerson.save();
        res.status(201).json(newPerson);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create person' });
    }
});

// Get a single person by ID
app.get('/person/:id', async (req, res) => {
    try {
        const person = await Person.findById(req.params.id);
        if (!person) {
            return res.status(404).json({ message: 'Person not found' });
        }
        res.json(person);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch person' });
    }
});

// Update a person by ID
app.put('/person/:id', async (req, res) => {
    try {
        const updatedPerson = await Person.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedPerson) {
            return res.status(404).json({ message: 'Person not found' });
        }

        res.json(updatedPerson);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update person' });
    }
});

// Delete a person by ID
app.delete('/person/:id', async (req, res) => {
    try {
        const deletedPerson = await Person.findByIdAndDelete(req.params.id);
        if (!deletedPerson) {
            return res.status(404).json({ message: 'Person not found' });
        }
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete person' });
    }
});

// Server listening
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
