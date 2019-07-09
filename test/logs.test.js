'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const express = require('express');
const faker = require('faker');
const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');


const expect = chai.expect;

const should = chai.should();

const User = require('../models/user');
const Goal = require('../models/goal');
const Log = require('../models/log');
const { goals, logs, users } =  require('../db/database');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL, JWT_SECRET } = require('../db/config');

chai.use(chaiHttp);

describe('Habit Tracker User Logs', function () {
    let user;
    let token;
  
    before(function () {
      return mongoose.connect(TEST_DATABASE_URL, { useNewUrlParser: true, useCreateIndex : true })
        .then(() => mongoose.connection.db.dropDatabase());
    });
  
    beforeEach(function () {
      return Promise.all([
        User.insertMany(users),
        Log.insertMany(logs),
      ])
        .then(([users]) => {
          user = users[0];
          token = jwt.sign({user}, JWT_SECRET, {subject: user.username});
        });
    });
  
    afterEach(function () {
      return Promise.all([
      
      ]);
    });
  
    after(function () {
      return mongoose.disconnect();
    });
});