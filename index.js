const express = require('express')
const mongoose = require('mongoose')
const app = express()
const users = require('./routes/user.route')
const tasks = require('./routes/task.route')

mongoose
  .connect('mongodb://localhost:27017/ToDoApp')
  .then(() => {
    console.log('Connect successfully!')
  })
  .catch((err) => console.log('Connect failure!', err))

app.use(express.json())

app.use('/', users)

app.use('/', tasks)

app.listen(3001, () => console.log('Listening on port 3001...'))
