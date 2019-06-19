'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const logSchema = new mongoose.Schema({
    datePosted: { type: Date, default: Date.now },
    message: { type: String, required: true },
    deadline: { type: Date },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

logSchema.methods.serialize = function() {
    let log = {
        id: this._id,
        datePosted: this.datePosted,
        message: this.message,
        deadline: this.deadline,
        username: this.user.username
    };
    return log;
};

const Log = mongoose.model("Log", logSchema);
module.exports = { Log };
