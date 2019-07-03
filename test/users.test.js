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

function tearDownDb() {
    return new Promise((resolve, reject) => {
        console.warn('Deleting database');
        mongoose.connection
        .dropDatabase()
        .then(result => resolve(result))
        .catch(err => reject(err));
    });   
  } 

function seedUserData() {
    console.info("seeding user data");
    const seedData = [];
    for (let i = 1; i <= 10; i++) {
        seedData.push({
            user: {
                username: faker.internet.username(),
                password: faker.internet.password()
            }
        });

        return URLSearchParams.insertMany(seedData);
    }  
}

describe('User API resource', function () {
    before(function () {
        return runServer(TEST_DATABASE_URL);
    });
  
    beforeEach(function () {
        return seedUserData();
    });

    afterEach(function () {
        return tearDownDb();
    });
  
    after(function () {
        return closeServer();
    });

  describe('GET login endpoint', function () {
      // render the login page
      it('should return all exiting users', function () {
          let res;
          return chai.request(app)
              .get('/users')
              .then(_res => {
                  res = _res;
                  res.should.have.status(200);
                  res.body.should.have.lengthOf.at.least(1);

                  return URLSearchParams.count();
              })
              .then(count => {
                  res.body.should.have.lengthOf(count);
              });
            });
    it('should return users with right fields', function() {
        let resUser;
        return chai
            .request(app)
            .get('/users')
            .then(function(res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a("array");
                res.body.should.have.lengthOf.at.least(1);

                res.body.forEach(function(user) {
                    user.should.be.a("object");
                    user.should.include.keys(
                        "id",
                        "username",
                        "password",
                    );
                });

                resUser = res.body[0];
                return URLSearchParams.findById(resUser.id);
            })
            .then(user => {
                resUser.name.should.equal(users.name);
                resUser.username.should.equal(users.username);
            });
    });
  });

  describe('POST login endpoint', function () {
    // create a user then log in as that user
    // make a POST request and get redirected to user dashboard
    it('should add a new user', function () {
        const newUser = {
            username: faker.internet.username(),
            password: faker.internet.password(),
        };
        return chai
            .request(app)
            .post('/users')
            .send(newUser)
            .then(function (res) {
                res.should.have.status(201);
            res.should.be.json;
            res.body.should.be.a("object");
            res.body.should.include.keys(
                "id",
                "username",
                "password",
            );
            res.body.id.should.not.be.null;
            return Users.findById(res.body.id);
        })
        .then(function(user) {
            user.username.should.equal(newUser.username);
            user.password.should.equal(newUser.password);
          });
        })
    });
});
