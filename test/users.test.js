'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

// this makes the should syntax available throughout this module
const should = chai.should();

// Import server.js and use destructuring assignment to create variables for
// server.app, server.runServer, and server.closeServer
const { app, runServer, closeServer } = require('../server');
const { User } = require('../models/user');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

// this function deletes the entire database to 
// ensure data from one test does not stick around
// for the next one
function tearDownDb() {
    return new Promise((resolve, reject) => {
        console.warn('Deleting database');
        mongoose.connection
        .dropDatabase()
        .then(result => resolve(result))
        .catch(err => reject(err));
    });   
  } 

describe('User', function () {
    // before tests run, activate the server
    before(function () {
        return runServer(TEST_DATABASE_URL);
    });
    
      afterEach(function () {
        // tear down database so we ensure no state from this test
        // effects any coming after.
        return tearDownDb();
      });    

    // close server after these tests run
    after(function () {
        return closeServer();
    });

    describe('GET endpoint', function () {

        it('should list all users on GET', function() {
            return chai.request(app)
                .get('/user')
                .then(function(res) {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('array');
                    res.body.should.have.length.of.at.least(1);

                    // each user should be an object with key/value pairs
                    // for `username` and `password`.
                    res.body.forEach(function(item) {
                        expect(item).to.be.a('object');
                        expect(item).to.have.all.keys(
                            'username', 'password');
                    });
                });
        });
    });

    describe('POST endpoint', function () {

        it('should add a new user on POST', function () {
            const newUser = {
                username: 'exampleUser',
                password: 'examplePass'
            };
            let res; 
            return chai
                .request(app)
                .post('/user')
                .send({
                username,
                password
                })
                .then(function(res) {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.keys(
                    'username',
                    'id'
                    );
                    expect(res.body.username).to.equal(username);
                    return User.findOne({
                    username
                    });
                })
                .then(user => {
                    expect(user).to.not.be.null;
                    return user.validatePassword(password);
                })
                .then(passwordIsCorrect => {
                    expect(passwordIsCorrect).to.be.true;
                });
            });
            
            it("should error if POST missing expected values", function() {
                const badRequestedData = {};
                return chai
                    .request(app)
                    .post("/user")
                    .send(badRequestedData)
                    .then(function(res) {
                        expect(res).to.have.status(400);
                    });
            });
        });
    });
