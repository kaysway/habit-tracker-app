'use strict'

const passport = require('passport');
const {Strategy: JwtStrategy, ExtractJwt, LocalStrategy} = require('passport-local');
const { JWT_SECRET } = require('./config');

const User = require('../models/user');

// Define and create basicStrategy
const localStrategy = new LocalStrategy((username, password, done) => {
    let user;
    User.findOne({ username })
      .then(results => {
        user = results;
        if(!user) {
          return Promise.reject({
            reason: 'LoginError',
            message: 'Incorrect username',
            location: 'username'
          });
        }
        return user.validatePassword(password);
      })
      .then(isValid => {
        if (!isValid) {
          return Promise.reject({
            reason: 'LoginError',
            message: 'Incorrect password',
            location: 'password'
          });
        }
        return done(null, user);
      })
      .catch(err => {
        if (err.reason === 'LoginError') {
          return done(null, false);
        }
        return done(err);
      });
  });

  const options = {
    secretOrKey: JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    algorithms: ['HS256']
  };
  
  const jwtStrategy = new JwtStrategy(options, (payload, done) => {
    done(null, payload.user);
  });
  
  
  module.exports = { localStrategy, JwtStrategy };  