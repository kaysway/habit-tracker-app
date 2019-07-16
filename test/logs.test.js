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
const { Log } = require('../models/log');

chai.use(chaiHttp);

// describe('Habit Tracker User Logs', function () {
//     let user;
//     let token;
  
//     before(function () {
//       return mongoose.connect(TEST_DATABASE_URL, { useNewUrlParser: true, useCreateIndex : true })
//         .then(() => mongoose.connection.db.dropDatabase());
//     });
  
//     beforeEach(function () {
//       return Promise.all([
//         User.insertMany(users),
//         Log.insertMany(logs),
//       ])
//         .then(([users]) => {
//           user = users[0];
//           token = jwt.sign({user}, JWT_SECRET, {subject: user.username});
//         });
//     });
  
//     afterEach(function () {
//       return Promise.all([
      
//       ]);
//     });
  
//     after(function () {
//       return mongoose.disconnect();
//     });
// });