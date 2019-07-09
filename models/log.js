'use strict';
const mongoose = require('mongoose');
const User = require("./user");

mongoose.Promise = global.Promise;

const logSchema = mongoose.Schema({
    title: {type: String, required: true },
    created: { type: Date, default: Date.now },
    content: { type: String, required: true },
    status: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

logSchema.pre('find', function (next) {
    this.populate('user');
    next();
  })
  
  logSchema.pre('findOne', function (next) {
    this.populate('user');
    next();
  })

logSchema.methods.serialize = function() {
    return  {
        id: this._id,
        title: this.title,
        created: moment(this.created).format("ddd, MMM DD, YYYY"),
        user: this.user.serialize(),
        content: this.content,
        status: this.status
    };
};

module.exports = mongoose.model('Log', logSchema);
