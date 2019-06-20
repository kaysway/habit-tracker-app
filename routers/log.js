'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const { Log } = require('./models/log');

const router = express.Router();

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;


module.exports = { router };
