"use strict";

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const passport = require('passport');
const morgan = require('morgan');
mongoose.Promise = global.Promise;

const { router: userRouter} = require("./routers/user");
const { router: goalRouter } = require('./routers/goal');
const { router: logRouter } = require('./routers/log');

const {User} = require('./models/user');
const {Goal} = require('./models/goal');
const {Log} = require('./models/log');


const { PORT, DATABASE_URL } = require("./config/database");

const app = express();

// log the http layer
app.use(morgan('common'));

app.use(express.json());

// serve assets located in a folder named public
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

app.use("/user", userRouter);
app.use("/goal", goalRouter);
app.use("/log", logRouter);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.use("*", function(req, res) {
  res.status(404).json({ message: "Not Found" });
});

app.use(function(err, req, res, next) {
  console.log(err)
  return res.status(500).json({ message: 'Internal Server Error' });
});

app.get("/user", (req, res) => {
  User
    .find()
    .then(user => {
      res.json(user.map(user => {
        return {
          id: username._id
        };
      }));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});

app.post('/user', (req, res) => {
  const requiredFields = ['username', 'password'];
  requiredFields.forEach(field => {
    if(!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  });

  User
    .findOne({ username: req.body.username })
    .then(user => {
      if (user) {
        const message = `Username already taken`;
        console.error(message);
        return res.status(400).send(message);
      }
      else {
        User
          .create({
            username: req.body.username,
            password: req.body.password
          })
          .then(user => res.status(201).json({
              _id: user.id,
              username: user.username,
              password: user.password
            }))
          .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong' });
          });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went horribly awry' });
    });
});

// app.get('/goal', (req, res) => {
//   Goal
//     .find()
//     .then(goal => {
//       res.json(goal.map(goal => {
//         return {
//           id: goal._id
//         };
//       }));
//     })
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({ error: 'something went terribly wrong' });
//     });
// });


// app.get('/goal/:id', (req, res) => {
//   Goal
//     .findById(req.params.id)
//     .then(post => {
//       res.json({
//         id: goal._id,
//         user: goal.username,
//       });
//     })
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({ error: 'something went horribly awry' });
//     });
// });


// this function starts our server and returns a Promise.
function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve();
    })
    .on('error', err => {
      reject(err);
    });
  });
}

// both runServer and closeServer need to access the same
// server object, so we declare `server` here, and then when
// runServer runs, it assigns a value.
let server;

function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve(server);
    }).on('error', err => {
      reject(err)
    });
  });
}

// like `runServer`, this function also needs to return a promise.
// `server.close` does not return a promise on its own, so we manually
// create one.
function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if (err) {
        reject(err);
        // so we don't also call `resolve()`
        return;
      }
      resolve();
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
};

app.listen(process.env.PORT || 8080, () => console.log(
  `Your app is listening on port ${process.env.PORT}`));

module.exports = { app, runServer, closeServer };
