'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const { User, Goal } = require('./models');

const router = express.Router();

router.post('/user', jsonParser, (req, res) => {
    const requiredFields = ['username', 'password'];
    const missingField = requiredFields.find(
        field => !(field in req.body)
    );

    if (missingField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Missing information',
            location: missingField
        });
    }

    const stringFields = ['username', 'password'];
    const nonStringField = stringFields.find(
        field => field in req.body && typeof req.body[field] !== 'string'
    );

    if (nonStringField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'expected string',
            location: nonStringField
        });
    }

    let { username, password } = req.body;

    return User
        .find({ username })
        .count()
        .then(count => {
            if (count > 0) {
                return Promise.reject({
                    code: 422,
                    reason: 'ValidationError',
                    message: 'Username taken',
                    location: 'username'
                });
            }

            return User.hashPassword(password);
        })
        .then(hash => {
            return User.create({
                username,
                password: hash
            });
        })
        .then(user => {
            return res.status(201).json(user.seriazlize());
        })
        .catch(err => {
            console.log(err);
            if (err.reason === 'ValidationError') {
                return res.status(err.code).json(err);
            }
            res.status(500).json({
                code: 500,
                message: 'Server error while creating user'
            });
        });

    router.get('/goal', (req, res) => {
        Goal
            .findbyId(req.params.id)
            .then(goal => {
                return res.json(goal.serialize());
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: 'Internal server error' });
            });
    })

    router.put('/goal/:id', (req, res) => {
        if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
            res.status(400).json({
                error: 'Request path id and request body id values must match'
            });
        }

        const updated = {};
        const updateableFields = ['goal', 'value'];
        updateableFields.forEach(field => {
            if (field in req.body) {
                updated[field] = req.body[field];
            }
        });

        Goal
        .findByIdAndUpdate(req.params.id, { $set: updated }, {new: true })
        .then(updatedGoal => res.status(204).end())
        .catch(err => res.status(500).json({ message: 'Internal server error'}));
    })
};

module.exports = { router };

