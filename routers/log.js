'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { Log } = require('../models/log');

const router = express.Router();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


// Post to add a new log by user to a selected goal
router.post('/', jwtAuth, (req, res) => {
    const requiredFields = ['title', 'content'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            return res.status(400).send(message);
        }
    }

    Log.create({
        title: req.body.title,
        created: req.body.created,
        content: req.body.content,
        status: req.body.status
    }) 
        .then(log => res.status(201).json(entry.serialize()))
        .catch(err => {
        res.status(500).json({ error: 'Something went wrong' });
        });
    User.find({ username: req.user.username })
        .then(result => {
            return result[0]._id;
        })
        .then(id => {
            return Log.findOneandUpdate({ title: req.body.title }, { user: id });
        })
        .catch(err => {
            res.status(500).json({ error: 'Something went wrong' });
        });
});

module.exports = { router };
