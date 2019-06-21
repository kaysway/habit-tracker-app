'use strict';
const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comments: { type: String, required: true },
    complete: String,
    dueDate: String
  });
  
  taskSchema.methods.serialize = function() {
    return {
      id: this._id,
      comments: this.comments,
      complete: this.complete,
      dueDate: this.dueDate
    };
  };

  const Task = mongoose.model('Task', taskSchema);
  module.exports = { Task };

