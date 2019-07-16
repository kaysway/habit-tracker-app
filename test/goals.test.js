'use strict';

const { TEST_DATABASE_URL } = require('../config');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

// this makes the should syntax available throughout this module
const should = chai.should();

// Import server.js and use destructuring assignment to create variables for
// server.app, server.runServer, and server.closeServer
const { app, runServer, closeServer } = require('../server');
const { Goal } = require('../models/goal');

chai.use(chaiHttp);