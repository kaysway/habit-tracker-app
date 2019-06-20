'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const { Task } = require('../models/task');

const router = express.Router();

// Access user information
router.get("/", (req, res) => {
    const {_id } = req.user;

// Find tasks associated with user
Task.find({ user: _id }).then(tasks => res.json({ tasks }));
});

// Update existing task
router.put('/task/:id', (req, res) => {
    const { _id } = req.body;
    const { notes, complete, priority } = req.body;

// Verify param id and body id match
    if (!(req.params.id && _id && req.params.id === _id)) {
        return res.status(400).json({
            error: 'Request path id and request body id values must match'
        });
    }
// Determine fields to update
    const updated = {};
    const updateableFields = ['notes', 'complete', 'priority'];
    updateableFields.forEach(field => {
        if (field in req.body) {
            updated[field] = req.body[field];
        }
    });

    // Update tasks
    return Task
    .findByIdAndUpdate(_id, { $set: updated }, {new: true })
    .then(updatedTask => {
        res.status(204).json(updatedTask);
        }
    );
});

module.exports = { router };

