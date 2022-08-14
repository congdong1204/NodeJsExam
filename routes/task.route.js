const express = require('express')
const Todo = require('../models/task.model')
const router = express.Router()
const authMiddleware = require('../middlewares/auth.middleware')
const Joi = require('joi')

const validationTask = (body) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    status: Joi.string().valid('To Do', 'In Progress', 'Done'),
    userId: Joi.string(),
  })
  return schema.validate(body)
}

router.post('/api/tasks', authMiddleware, async (req, res) => {
  const { error } = validationTask(req.body)
  if (error) {
    res.status(400).send({
      message: error.details[0].message,
    })
  } else {
    try {
      const todo = new Todo({
        name: req.body.name,
        status: req.body.status,
        userId: req.user._id,
      })
      const result = await todo.save()
      res.send(result)
    } catch {
      res.status(400).send('Create task failure!')
    }
  }
})

router.get('/api/tasks', authMiddleware, async (req, res) => {
  const todos = await Todo.find({
    userId: req.user._id,
  })
  res.send(todos)
})

router.get('/api/tasks/:id', authMiddleware, async (req, res) => {
  const todo = await Todo.findOne({ _id: req.params.id, userId: req.user._id })
  if (!todo) {
    return res.status(404).send({ message: 'Task not found' })
  }
  res.send(todo)
})

router.delete('/api/tasks/:id', authMiddleware, async (req, res) => {
  const todo = await Todo.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  })
  if (!todo) {
    return res.status(404).send({ message: 'Task not found' })
  }
  res.send(todo)
})

router.put('/api/tasks/:id', authMiddleware, async (req, res) => {
  const { error } = validationTask(req.body)
  if (error) {
    res.status(400).send({
      message: error.details[0].message,
    })
  } else {
    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.user._id,
    })
    if (!todo) {
      return res.status(404).send({ message: 'Task not found' })
    }
    Object.assign(todo, req.body)
    await todo.save()
    res.send(todo)
  }
})

module.exports = router
