"use strict";

const express = require('express');
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require("./config");
const { User } = require("./models");

const app = express();
app.use(express.json());

// GET requests to /goals => return habit list

// PUT request to /habit => update a selected habit with log comments
// or completing a daily task

// catch-all endpoint if client makes request to non-existent endpoint
app.use("*", function(req, res) {
  res.status(404).json({ message: "Not Found" });
});

let server;

function runServer(databaseUrl, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
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

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
};

module.exports = { app, runServer, closeServer };
