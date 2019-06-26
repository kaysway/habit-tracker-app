"use strict";

require('dotenv').config();

const express = require('express');
const mongoose = require("mongoose");
const passport = require('passport');
const morgan = require('morgan');

const { router: userRouter} = require("./routers/user");
const { router: goalRouter } = require('./routers/goal');
const { router: logRouter } = require('./routers/log');
const { router: taskRouter } = require('./routers/task');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require("./config/database");

const app = express();

app.use(morgan('common'));
app.use(express.static("public"));

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

passport.use(localStategy);
passport.use(jwtStrategy);

app.use("./routers/user", userRouter);
app.use("./routers/goal", goalRouter);
app.use("./routers/log", logRouter);
app.use("./routers/task", taskRouter);
app.use('./auth', authRouter);

const jwtAuth = passport.authenticate('jwt', { session: false });

// A protected endpoint which needs a valid JWT to access it
app.get('/api/protected', jwtAuth, (req, res) => {
  return res.json({
    data: 'rosebud'
  });
});

app.use("*", function(req, res) {
  res.status(404).json({ message: "Not Found" });
});

app.use(function(err, req, res, next) {
  console.log(err)
  return res.status(500).json({ message: 'Internal Server Error' });
});

const bodyParser = require('body-parser');
const SECRET = process.env.SECRET;
let shortDateFormat = "ddd, MMM DD YYYY";
app.locals.moment = moment;
app.locals.shortDateFormat = shortDateFormat;

const path = require('path');

app.use(express.json());

require('./config/passport');

// required for passport
app.use(session({
  secret: SECRET,
  resave: true,
  saveUninitialized: true 
}));
app.use(passport.initialize());
app.use(passport.session());

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
