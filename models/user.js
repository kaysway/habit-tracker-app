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
    user: {
        firstName: String,
        lastName: String
    },
    password: { 
        type: String, 
        required: true 
    }
});

userSchema.virtual('userName').get(function() {
    return `${this.user.firstName} ${this.user.lastName}`.trim();
});

userSchema.methods.serialize = function() {
    return {
        id: this._id,
        username: this.username,
        user: this.user
    };
};

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = { User };