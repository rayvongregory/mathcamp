require("dotenv")
const User = require("../models/User")
const { StatusCodes } = require("http-status-codes")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const ejs = require("ejs")
const path = require("path")
const crypto = require("crypto")

const loginUser = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Invalid credentials, please try again." })
  }
  if (!user.isVerified) {
    return res.status(StatusCodes.OK).json({
      msg: "You must complete the registration process before you can login. Please click the link we sent to your email to complete registration. ",
      confirmed: false,
    })
  }
  const match = await user.matchPasswords(password)
  if (match) {
    const refreshToken = user.generateRefreshToken()
    const accessToken = user.generateAccessToken()
    user.lastLogin = Date.now()
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
    { lastLogout: Date.now() }
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

const verifyUser = async (req, res) => {
  const { verificationToken } = req.body
  const { email } = req.params
  const user = await User.findOne({ email })
  if (!user) {
    return res.status(StatusCodes.FORBIDDEN).json({ responseURL: "/forbidden" })
  }
  if (user.isVerified && user.verificationToken === verificationToken) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ responseURL: "/already-verified", name: user.name.split(" ")[0] })
  }
  if (user.isVerified && user.verificationToken !== verificationToken) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ responseURL: "/bad-request" })
  }
  if (user.verificationToken === verificationToken) {
    user.isVerified = true
    user.verified = Date.now()
    await user.save()
    return res
      .status(StatusCodes.ACCEPTED)
      .json({ responseURL: "/welcome", name: user.name.split(" ")[0] })
  }
  res.status(StatusCodes.BAD_REQUEST).json({ responseURL: "/bad-request" })
}

const registerUser = async (req, res) => {
  let { name, email, password } = req.body
  let user = await User.findOne({ email })
  if (user) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: `There is already an account associated with this email.` })
  }
  const verificationToken = crypto.randomBytes(40).toString("hex")
  user = new User({ name, email, password, verificationToken })
  await user.hashPassword()
  user.createDisplayName()
  await user.save()
  const { id } = user
  //according to john, we want to send a token instead of an id
  const url = `${req.protocol}://${req.get(
    "host"
  )}/verify-user?v-token=${verificationToken}&email=${email}`
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: process.env.user,
      pass: process.env.pass,
    },
  })
  name = user.name.split(" ")[0]
  const file = path.join(
    __dirname,
    "../views/pages/auth-pages/verify_email.ejs"
  )
  const data = await ejs.renderFile(file, {
    name,
    url,
  })
  transporter.sendMail({
    from: '"Math Camp" <support@mathcamp.com>',
    to: user.email,
    subject: "Welcome to Math Camp",
    text: `Hi, ${name}!\n\n\rUse the link below to complete registration.\n\r${url}`,
    html: data,
  })
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Please check your email to verify your account.", name })
}

module.exports = {
  loginUser,
  verifyUser,
  registerUser,
  logoutUser,
}
