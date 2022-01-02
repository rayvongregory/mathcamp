require("dotenv")
const User = require("../models/User")
const ObjectId = require("mongoose").Types.ObjectId
const { StatusCodes } = require("http-status-codes")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const ejs = require("ejs")
const path = require("path")

const loginUser = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Invalid credentials, please try again." })
  }
  if (!user.confirmed) {
    return res.status(StatusCodes.OK).json({
      msg: "You must complete the registration process before you can login. Please click the link we sent to your email to complete registration. ",
      confirmed: false,
    })
  }
  const match = await user.matchPasswords(password)
  if (match) {
    const refreshToken = user.generateRefreshToken()
    const accessToken = user.generateAccessToken()
    user.getAvatar()
    await user.save()
    return res.status(StatusCodes.OK).json({
      accessToken,
      refreshToken,
      msg: `Welcome back, ${user.displayName.split(" ")[0]}.`,
      confirmed: true,
    })
  }
  res
    .status(StatusCodes.UNAUTHORIZED)
    .json({ msg: "Invalid credentials, please try again." })
}

const logoutUser = async (req, res) => {
  const { token } = req.body
  //! decode does not verify, nor does it require the secret string
  const email = jwt.decode(token.split(" ")[1]).email
  const user = await User.findOneAndUpdate(
    { email },
    { lastLogout: new Date() }
  )
  if (!user) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "No such user is logged in." })
  }
  user.removeRefreshToken()
  res
    .status(StatusCodes.OK)
    .json({ msg: "Local/session storage can be cleared" })
  // we will delete the user's refresh token here and clear local storage
}

const verifyId = async (req, res, next) => {
  const { id } = req.params
  try {
    let objId = new ObjectId(id)
    if (objId == id) {
      req.body.valid = true
    } else {
      req.body.valid = false
    }
  } catch (err) {
    req.body.valid = false
  }
  next()
}

const verifyUser = async (req, res) => {
  const { valid } = req.body
  const { id } = req.params
  if (!valid) {
    return res.status(StatusCodes.BAD_REQUEST)
  }
  const user = await User.findById(id)
  if (!user) {
    return res.status(StatusCodes.UNAUTHORIZED)
  }
  if (user.confirmed) {
    return res.status(StatusCodes.OK).json({
      msg: "Looks like you've already verified your account. Please sign in.",
    })
  }
  user.confirmed = true
  await user.save()
  res.status(StatusCodes.OK).json({
    msg: "You have completed the registration process and you may now sign in. ",
  })
}

const registerUser = async (req, res) => {
  const { email } = req.body
  let user = await User.findOne({ email })
  if (user) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: `There is already an account associated with this email.` })
  }
  user = new User(req.body)
  await user.hashPassword()
  user.createDisplayName()
  user.getAvatar()
  await user.save()
  const { id } = user
  const url = `${req.protocol}://${req.get("host")}${req.url}/${id}`
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: process.env.user,
      pass: process.env.pass,
    },
  })
  const name = user.name.split(" ")[0]
  const file = path.join(__dirname, "../views/pages/verify_email.ejs")
  const data = await ejs.renderFile(file, {
    name,
    url,
  })
  transporter.sendMail({
    from: '"Math Camp" <support@mathcamp.com>',
    to: user.email,
    subject: "Welcome to Math Camp",
    text: `Hi, ${name}!\n\n\rClick the link below to complete registration.\n\r${url}`,
    html: data,
  })
  res.status(StatusCodes.OK).json({ name })
}

module.exports = {
  loginUser,
  verifyId,
  verifyUser,
  registerUser,
  logoutUser,
}
