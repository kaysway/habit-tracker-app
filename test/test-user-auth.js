'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const mongoose = require('mongoose');


const expect = chai.expect;

const User = require('../models/user');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config/database');
const faker = require('faker');
chai.use(chaiHttp);

  describe('GET login endpoint', function () {
      // render the login page
      it('should render the login page', function () {
          let res;
          return chai.request(app)
              .get('/login')
              .then(function (_res) {
                  res = _res;
                  expect(res).to.have.status(200);
              })
      });
  });

  describe('POST login endpoint', function () {
    // create a user then log in as that user
    // make a POST request and get redirected to user dashboard
    it('should render the dashboard page', function () {
        let res;
        let logUser = {
            email: 'test@test.com',
            emailv: 'test@test.com',
            password: 'test',
            passwrodv: 'test'
        }
        return chai.request(app)
            .post('/signup')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                email: 'test@test.com',
                emailv: 'test@test.com',
                password: 'test',
                passwordv: 'test'
            })
            .then(function (_res) {
                res = _res;
                expect(res).to.have.status(200);
                return chai.request(app)
                    .post('/login')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .send(logUser)
                    .then(function (_res) {
                        res = _res;
                        expect(res).to.have.status(200);
                    })
            })
    });
});

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
  }
  
  describe('User API resource', function () {
    before(function () {
  
        return runServer(TEST_DATABASE_URL);
  
    });
  
    beforeEach(function () {
  
    });
  
    afterEach(function () {
        return tearDownDb();
    });
  
    after(function () {
        return closeServer();
    });
});