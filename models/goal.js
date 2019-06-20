'use strict'
const mongoose = require("mongoose");

const goalSchema = mongoose.Schema({
    name: String,
    description: String,
    complete: String,
    dueDate: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

const Goal = mongoose.model("Goal", goalSchema);

module.exports = { Goal };