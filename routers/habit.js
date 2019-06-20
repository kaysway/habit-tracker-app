'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const { Habit } = require('./models');

const router = express.Router();

router.get('/habit', (req, res) => {
    Habit
        .findbyId(req.params.id)
        .then(habit => {
            return res.json(habit.serialize());
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        });
})

router.put('/habit/:id', (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        res.status(400).json({
            error: 'Request path id and request body id values must match'
        });
    }

    const updated = {};
    const updateableFields = ['habit', 'value'];
    updateableFields.forEach(field => {
        if (field in req.body) {
            updated[field] = req.body[field];
        }
    });

    Habit
    .findByIdAndUpdate(req.params.id, { $set: updated }, {new: true })
    .then(updatedHabit => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error'}));
});

moduel.exports = { router };