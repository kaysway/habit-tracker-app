'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const { User } = require('../models/user');

const router = express.Router();

router.post('/', jsonParser, (req, res) => {
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
}



module.exports = router;

