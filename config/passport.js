'use strict'

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../app/models/user');

// serialize the user for the session
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

// deserialize the user
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

// local signup

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},
function(req, username, password, done) {

    User
        .findOne({ 'username': username }, function(err, user) {
            if (err)
                return done(err);

            if (!user)
                return done(null, false, req.flash('loginMessage', 'Incorrect username. Try again.'));

            if (!user.validatePassword(password)) 
                return done(null, false, req.flash('loginMessage', 'Incorrect password. Try again.'));

            return done(null, user);
        });
}));

passport.use('local-signup', new LocalStrategy({
usernameField: 'username',
passwordField: 'password',
passReqToCallback: true
},
function(req, username, password, done) {
process.nextTick(function() {

    User
        .findOne({ 'username': username }, function(err, user) {
            if (err)
                return done(err);

            if (user) {
                return done(null, false, req.flash('signupMessage', 'That username is already taken'));

            } else {
                const newUser = User();

                newUser.username = username;
                newUser.password = newUser.generateHash(password);

                newUser.save(function(err) {
                    if (err)
                        throw err;

                    return done(null, newUser);
                });
            }
        });
    });
}));