const mongoose = require("mongoose")
const { Schema } = mongoose
const gravatar = require("gravatar")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const redis = require("redis")
const refreshTokens = require("../db/redis-cache")
const { promisify } = require("util")
const getAsync = promisify(refreshTokens.get).bind(refreshTokens)
const scanAsync = promisify(refreshTokens.scan).bind(refreshTokens)

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
    avatar: {
      type: String,
    },
    // contactEmail: {
    //   type: String,
    //   match: [
    //     /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    //     "This email address is not valid",
    //   ],
    //   default: this.email,
    // },
    password: {
      type: String,
      // match: [
      //   /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      //   "Password must contain at least 8 characters, at least one uppercase letter, at least one lowercase letter, at least one digit, and at least one special character",
      // ],
      required: [true, "Please provide a password."],
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
    lastLogin: {
      type: Date,
      default: new Date(),
    },
    lastLogout: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
)

userSchema.methods.createDisplayName = function () {
  let names = this.name.split(" ")
  this.displayName = `${names[0]}  ${names[1][0]}.`
}

userSchema.methods.getAvatar = function () {
  this.avatar = gravatar.url(
    this.contactEmail,
    { s: "40", r: "g", d: "retro" },
    true
  )
}

// userSchema.methods.createContactEmail = function () {
//   this.contactEmail = this.email
// }

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

userSchema.methods.generateAccessToken = function () {
  return (
    "Bearer " +
    jwt.sign(
      {
        role: this.role,
        email: this.email,
        displayName: this.displayName,
        avatar: this.avatar,
      },
      process.env.JWT_ACCESS_SECRET,
      {
        // expiresIn: "5s",
        expiresIn: "15m",
      }
    )
  )
}

userSchema.methods.generateRefreshToken = async function () {
  // this function will handle all operations regarding refresh tokens
  refreshTokens.set(
    `${this._id}`,
    (this.refreshToken = jwt.sign(
      { id: this._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "1d" }
      // { expiresIn: "3s" }
    ))
  )
  return await getAsync(`${this._id}`)
}

userSchema.methods.removeRefreshToken = async function () {
  // refreshTokens.get(`${this._id}`, redis.print)
  // this function removes the user's refresh token from redis cache on logout

  let token = await getAsync(`${this._id}`)
  token = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
  // console.log(138, token)

  //! get the token, set its expiration time to the current time and then delete
  //! it from the cache
  // refreshTokens.del(`${this._id}`)
  //maybe add more to this if necessary but I think this is all we need since the
  //del functiondoesn't throw an error
}

module.exports = mongoose.model("User", userSchema)
