'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const logSchema = new mongoose.Schema({
    datePosted: { type: Date, default: Date.now },
    comments: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

logSchema.methods.serialize = function() {
    let log = {
        id: this._id,
        datePosted: this.datePosted,
        userId: this.user._id
    };
    return log;
};

const Log = mongoose.model("Log", logSchema);
module.exports = { Log };
