const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid!')
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 6,
    },
  },
  { timestamps: true }
)

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this.id, email: this.email },
    'phamCongDongSecret'
  )
  return token
}

userSchema.pre('save', async function (next) {
  const rounds = 10
  const hash = await bcrypt.hash(this.password, rounds)
  this.password = hash
  next()
})

const User = mongoose.model('user', userSchema)

module.exports = User
