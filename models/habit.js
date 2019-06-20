'use strict'
const mongoose = require("mongoose");

const habitSchema = mongoose.Schema({
    name: String,
    description: String,
    complete: String,
    dueDate: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

const Habit = mongoose.model("Habit", goalSchema);

module.exports = { Habit };