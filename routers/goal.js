'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const { Goal } = require('../models/goal');

const router = express.Router();

// load goals selection list
router.get('/:userId', (req, res) => {
    let goals;
    Goal
        .find({user: req.params.userId})
        .then(returnedGoals => {
            return returnedGoals.serialize();
        }).catch  (err => {
            console.error(err);
            res.status(500).json({ error: 'something went terribly wrong' });
        });
});

module.exports = { router };