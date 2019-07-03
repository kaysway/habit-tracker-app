'use strict'
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const goalSchema = mongoose.Schema({
    goal: String,
    description: String,
    status: { type: String },
    dueDate: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

goalSchema.methods.serialize = function () {
    return {
        id: this._id,
        goal: this.goal,
        description: this.description,
        dueDate: this.dueDate,
        status: this.status
    };
};

const Goal = mongoose.model("Goal", goalSchema);

module.exports = { Goal };