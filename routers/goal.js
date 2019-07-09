'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const { Goal } = require('../models/goal');

const router = express.Router();

// load goals selection list
router.get('/:userId', (req, res) => {
    Goal
        .find({user: req.params.userId})
        .then(goals => {
            // return goals.serialize();
            res.status(201).json(goals.serialize());
        }).catch (err => {
            console.error(err);
            res.status(500).json({ error: 'something went terribly wrong' });
        });
});

module.exports = { router };