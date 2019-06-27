'use strict';
const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    detail: { type: String, required: true },
    complete: String,
    dueDate: String
  });
  
  taskSchema.methods.serialize = function() {
    return {
      id: this._id,
      detail: this.detail,
      complete: this.complete,
      dueDate: this.dueDate
    };
  };

  const Task = mongoose.model('Task', taskSchema);
  module.exports = { Task };

