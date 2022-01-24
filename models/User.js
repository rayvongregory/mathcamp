const mongoose = require("mongoose")
const { Schema } = mongoose
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const refreshTokens = require("../db/redis-cache")
const crypto = require("crypto")

const userSchema = new Schema(
  {
    name: {
      type: String,
      minLength: 3,
      required: [true, "Please enter your name."],
    },
    email: {
      type: String,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "This email address is not valid",
      ],
      required: [true, "Please provide an email address."],
      unique: true,
    },
    password: {
      type: String,
      match: [
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[~#=_{}/<>,.;:`+'"|?(!\[@$)%^\]&*-]).{8,}$/,
        "Password must contain at least 8 characters, at least one uppercase letter, at least one lowercase letter, at least one digit, and at least one special character",
      ],
      required: [true, "Please provide a valid password."],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    displayName: {
      type: String,
      required: [true, "Please provide a display name for this user"],
    },
    verificationString: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    verified: Date,
    lastLogin: {
      type: Date,
      default: null,
    },
    lastLogout: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
)

userSchema.methods.hashPassword = async function () {
  this.password = await bcrypt.hash(this.password, 10)
}

userSchema.methods.matchPasswords = async function (incomingPassword) {
  return await bcrypt.compare(incomingPassword, this.password)
}

userSchema.methods.updateTime = function (event) {
  switch (event) {
    case "login":
      this.lastLogin = Date.now()
      break
    case "logout":
      this.lastLogout = Date.now()
  }
}

userSchema.methods.generateRedisToken = async function (id, ip, userAgent) {
  let key = crypto.randomBytes(40).toString("hex")
  refreshTokens.set(
    key,
    (this.refreshToken = jwt.sign(
      { id, ip, userAgent },
      process.env.JWT_SECRET
    ))
  )
  return key
}

userSchema.methods.generateTokens = function (id, key) {
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET)
  const refreshToken = jwt.sign({ id, key }, process.env.JWT_SECRET)
  return { accessToken, refreshToken }
}

userSchema.methods.removeRedisToken = async function (key) {
  refreshTokens.del(key)
}

module.exports = mongoose.model("User", userSchema)
