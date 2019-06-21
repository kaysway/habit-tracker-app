'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const { Goal } = require('../models/goal');

const router = express.Router();

// load goals selection list
router.get('/goal', (req, res) => {
    let goals;
    Goal
        .findbyId()
        .then(returnedGoals => {
            goals = returnedGoals;
            return GoalPost.find();
        }).then(goalposts => {
            res.render('/pages/view-goals', {
                user: req.user,
                goals: goals,
                tasks: tasks
            });
        });
    });

module.exports = { router };