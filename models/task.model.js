const mongoose = require('mongoose')

const todoSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    status: {
      type: String,
      enum: ['To Do', 'In Progress', 'Done'],
      default: 'To Do',
    },
    userId: { type: String },
  },
  { timestamps: true }
)

const Todo = mongoose.model('todo', todoSchema)

module.exports = Todo
