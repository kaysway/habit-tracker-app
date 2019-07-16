'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const jsonParser = bodyParser.json();
const jwt = require('jsonwebtoken');
const jwtAuth = passport.authenticate('jwt', {session: false});

const { Goal } = require('../models/goal');

const router = express.Router();

// load goals selection list
router.get('/:userId', (req, res, next) => {
    Goal
        .find({user: req.params.userId})
        .then(goals => {
            res.status(201).json(goals.map(goal => {
                return goal.serialize();
            }));
        }).catch (err => {
            console.error(err);
            res.status(500).json({ error: 'something went terribly wrong' });
        });
});

// post and add a new goal to user's goal list
router.post('/', jwtAuth, (req, res) => {
    const requiredFields = ['goalName', 'description'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            return res.status(400).send(message);
        }
    }
    Goal
        .create({
            goalName: req.body.goalName,
            description: req.body.description,
            status: req.body.status,
            dueDate: req.body.dueDate,
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
          return Goal.findOneAndUpdate({ goalName: req.body.goalName }, { user: id });
        })
        .catch(err => {
          res.status(500).json({ error: 'Something went wrong' });
        });
    });


module.exports = { router };