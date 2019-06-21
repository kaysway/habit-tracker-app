'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const router = express.Router();

const { User } = require('./models/user');

router.use(express.json());

// Create new user
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

    // login
    router.get('/', (req, res) => {
        res.render('pages/index', { user: req.user
        });
    });

    // Verify username and password meets minimmum and maximum character requirements
  const requiredLengths = {
    username: {
      min: 4
    },
    password: {
      min: 8,
      max: 72
    }
  };
  const fieldTooSmall = Object.keys(requiredLengths).find(
    field =>
      "min" in requiredLengths[field] &&
      req.body[field].trim().length < requiredLengths[field].min
  );
  const fieldTooLarge = Object.keys(requiredLengths).find(
    field =>
      "max" in requiredLengths[field] &&
      req.body[field].trim().length > requiredLengths[field].max
  );

  if (fieldTooSmall || fieldTooLarge) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: fieldTooSmall
        ? `Must be at least ${
            requiredLengths[fieldTooSmall].min
          } character(s) long`
        : `Must be less than ${
            requiredLengths[fieldTooLarge].max
          } characters long`,
      location: fieldTooSmall || fieldTooLarge
    });
  }

  // Verify username and password are trimmed (no whitespace)
  const explTrimmedFields = ["username", "password"];
  const nonTrimmedField = explTrimmedFields.find(
    field => req.body[field] !== req.body[field].trim()
  );
  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "Cannot start or end with whitespace",
      location: nonTrimmedField
    });
  }

  // Verify passwords match
  if (req.body.password !== req.body.password2) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "Passwords do not match",
      location: "password"
    });
  }

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

module.exports = { router };