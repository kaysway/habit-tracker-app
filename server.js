"use strict";

// dependencies
require('dotenv').config();
const express = require('express');
const mongoose = require("mongoose");
const morgan = require('morgan');
const passport = require('passport');

const bodyParser = require('body-parser');
const SECRET = process.env.SECRET;
let shortDateFormat = "ddd, MMM DD YYYY";
app.locals.moment = moment;
app.locals.shortDateFormat = shortDateFormat;
mongoose.Promise = global.Promise;

const path = require('path');


app.use(express.static("public"));
const app = express();
app.use(morgan('common'));
app.use(express.json());

passport.use(localStategy);
passport.use(jwtStrategy);
require('./config/passport'); 


// routes
const { User } = require("./models/user");
const { router: userRouter} = require("./routers/user");
app.use("./routers/user", userRouter);

const { router: authRouter, localStrategy, jwtStrategy } = require('.auth');

// config
const { PORT, DATABASE_URL } = require("./config/database");

// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

// required for passport
app.use(session({
  secret: SECRET,
  resave: true,
  saveUninitialized: true 
}));
app.use(passport.initialize());
app.use(passport.session());


app.use("*", function(req, res) {
  res.status(404).json({ message: "Not Found" });
});


let server;

function runServer(DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL, err => {
      if (err) {
        return reject(err);
      }

      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
};

module.exports = { app, runServer, closeServer };
