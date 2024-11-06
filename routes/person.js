const express = require('express');
const router = express.Router();
const Person = require('../models/person');

// GET: List all people
router.get('/', async (req, res) => {
    try {
        const people = await Person.find();
        res.json(people);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST: Create a new person
router.post('/', async (req, res) => {
    const { name, age, gender, mobile } = req.body;
    const newPerson = new Person({ name, age, gender, mobile });
    
    try {
        await newPerson.save();
        res.status(201).json(newPerson);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT: Update a person by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedPerson = await Person.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedPerson);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE: Delete a person by ID
router.delete('/:id', async (req, res) => {
    try {
        await Person.findByIdAndDelete(req.params.id);
        res.status(200).send("Person deleted");
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
