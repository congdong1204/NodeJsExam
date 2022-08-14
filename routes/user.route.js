const express = require('express')
const User = require('../models/user.model')
const router = express.Router()
const bcrypt = require('bcrypt')
const Joi = require('joi')

const validationUser = (body) => {
  const schema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().required().min(6),
  })
  return schema.validate(body)
}

router.post('/api/register', async (req, res) => {
  const { error } = validationUser(req.body)
  if (error) {
    res.status(400).send({
      message: error.details[0].message,
    })
  } else {
    const user = await User.findOne({ email: req?.body?.email })
    if (user) {
      res.status(400).send('Email is exist')
    } else {
      try {
        const newUSer = new User({
          email: req.body.email,
          password: req.body.password,
        })
        const result = await newUSer.save()
        res.send(result)
      } catch {
        res.status(400).send('Create user failure!')
      }
    }
  }
})

router.post('/api/login', async (req, res) => {
  const { error } = validationUser(req.body)
  if (error) {
    res.status(400).send({
      message: error.details[0].message,
    })
  } else {
    let user = await User.findOne({ email: req.body.email })
    if (!user) {
      return res.status(400).send('Invalid email or password')
    }
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    )
    if (!isValidPassword) {
      return res.status(400).send('Invalid email or password')
    }
    const token = user.generateAuthToken()
    return res.send(token)
  }
})

module.exports = router
