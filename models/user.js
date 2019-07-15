'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true
    },
    password: { 
        type: String, 
        required: true 
    }
});

userSchema.methods.serialize = function() {
    return {
        username: this.username,
        id: this._id
    };
};

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
  };

  userSchema.statics.hashPassword = function(password) {
    return bcrypt.hash(password, 10);
  };

const User = mongoose.model('User', userSchema);
module.exports = { User };
