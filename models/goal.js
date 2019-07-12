'use strict'
const mongoose = require("mongoose");
const User = require("./user");

mongoose.Promise = global.Promise;

const goalSchema = mongoose.Schema({
    goalName: String,
    description: String,
    status: { type: String },
    dueDate: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

goalSchema.pre('find', function (next) {
    this.populate('user');
    next();
  })
  
  goalSchema.pre('findOne', function (next) {
    this.populate('user');
    next();
  })

goalSchema.methods.serialize = function () {
    return {
        id: this._id,
        goalName: this.goal,
        // user: this.user.serialize(),
        description: this.description,
        dueDate: this.dueDate,
        status: this.status
    };
};

const Goal = mongoose.model("Goal", goalSchema);

module.exports = { Goal };