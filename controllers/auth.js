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
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Invalid credentials, please try again." })
  }
  const match = await user.matchPasswords(password)
  if (match) {
    if (!user.isVerified) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        msg: "You must complete the registration process before you can login. Please click the link we sent to your email to complete registration. ",
      })
    }
    let { id } = user,
      { ip } = req,
      userAgent = req.headers["user-agent"]
    const refreshTokenKey = await user.generateRedisToken(id, ip, userAgent)
    const { refreshToken, accessToken } = user.generateTokens(
      id,
      refreshTokenKey
    )
    user.lastLogin = Date.now()
    await user.save()
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      signed: true,
      maxAge: 1000 * 60 * 15,
      path: "/",
      SameSite: "none",
    })
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      signed: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: "/",
      SameSite: "none",
    })
    return res.status(StatusCodes.OK).json({
      displayName: user.displayName,
    })
  }
  res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "Invalid credentials, please try again." })
}

const getKeyAndRemoveToken = (res, refreshToken, user) => {
  try {
    const { key } = jwt.verify(refreshToken, process.env.JWT_SECRET)
    user.removeRedisToken(key)
    res.cookie("accessToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    res.cookie("refreshToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    return res.status(StatusCodes.OK).json({ msg: "User has been logged out" })
  } catch (err) {
    const { key } = jwt.decode(refreshToken)
    user.removeRedisToken(key)
    res.cookie("accessToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    res.cookie("refreshToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    return res.status(StatusCodes.OK).json({ msg: "User has been logged out" })
  }
}

const logoutUser = async (req, res) => {
  const { userId: id } = req.body
  const user = await User.findOneAndUpdate(
    { _id: id },
    { lastLogout: Date.now() }
  )
  if (!user) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "No such user is logged in." })
  }
  getKeyAndRemoveToken(res, req.signedCookies.refreshToken, user)
}

const verifyVerificationToken = async (req, res, next) => {
  const { verificationToken } = req.body
  try {
    const { id: userId, verificationString } = jwt.verify(
      verificationToken,
      process.env.JWT_SECRET
    )
    req.body.userId = userId
    req.body.verificationString = verificationString
    next()
  } catch (err) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Token could not be verified", responseURL: "/bad-request" })
  }
}

const verifyUser = async (req, res) => {
  const { email } = req.params
  const { userId, verificationString } = req.body
  const user = await User.findOne({ email, _id: userId, verificationString })
  if (!user) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "No such user", responseURL: "/bad-request" })
  }
  user.isVerified = true
  user.verified = Date.now()
  user.verificationString = ""
  await user.save()
  const welcomeString = crypto.randomBytes(40).toString("hex")
  const welcomeToken = jwt.sign({ welcomeString }, process.env.JWT_SECRET)
  res.cookie("welcomeToken", welcomeToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    maxAge: 1000 * 60 * 10,
    path: "/",
    SameSite: "none",
  })
  return res.status(StatusCodes.ACCEPTED).json({ responseURL: "/welcome" })
}

const registerUser = async (req, res) => {
  let { name, email, password } = req.body
  let user = await User.findOne({ email })
  if (user) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({
        errs: [`There is already an account associated with this email.`],
      })
  }
  const verificationString = crypto.randomBytes(40).toString("hex")
  let names = name.split(" ")
  let displayName = `${names[0]}  ${names[1][0]}.`
  User.create(
    { name, displayName, email, password, verificationString },
    async (err, user) => {
      if (err) {
        if (err.name === "ValidationError") {
          let errs = Object.values(err.errors).map((val) => val.message)
          return res.status(StatusCodes.BAD_REQUEST).json({
            errs,
          })
        }
      } else {
        const verificationToken = jwt.sign(
          { id: user.id, verificationString },
          process.env.JWT_SECRET
        )
        await user.hashPassword()
        await user.save()
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
        res.status(StatusCodes.CREATED).json({ name })
      }
    }
  )
}

const getUserInfo = async (req, res) => {
  const { userId: id } = req.body
  const user = await User.findById(id, "name displayName email")
  if (!user) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "No user user" })
  }

  let { name, displayName, email } = user
  res.status(StatusCodes.OK).json({
    fname: name.split(" ")[0],
    lname: name.split(" ")[1],
    dname: displayName,
    email,
  })
}

const updateUserInfo = async (req, res) => {
  const { userId: id } = req.body
  const user = await User.findById(id)
  if (!user) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "No such user" })
  }
  const { newName, newDisplayName, newEmail, currentPassword, newPassword } =
    req.body
  if (
    (newName && newName !== user.name) ||
    (newDisplayName && newDisplayName !== user.displayName)
  ) {
    user.name = newName || user.name
    user.displayName = newDisplayName || user.displayName
    await user.save()
    return res.status(StatusCodes.OK).json({ msg: "Name(s) updated" })
  }

  if (newEmail) {
    let otherUser = await User.findOne({ newEmail })
    if (otherUser && otherUser.id !== user.id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "There is already an account associated with this email address.",
      })
    }
    user.email = newEmail
    await user.save()
    return res.status(StatusCodes.OK).json({ msg: "Email updated" })
  }

  if (currentPassword && newPassword) {
    const match = await user.matchPasswords(currentPassword)
    if (!match) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Incorrect password. Please try again." })
    }
    user.password = newPassword
    await user.hashPassword()
    await user.save()
    return res.status(StatusCodes.OK).json({ msg: "Password updated" })
  }
}

const deleteUserAccount = async (req, res) => {
  const { userId: id } = req.body
  const user = await User.findById(id)
  if (!user) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "No user user" })
  }
  if (pwd) {
    const match = await user.matchPasswords(pwd)
    if (match) {
      await User.findOneAndDelete({ _id: id })
      getKeyAndRemoveToken({
        res,
        refreshToken: req.signedCookies.refreshToken,
        user,
      })
      let comments = await Comment.find({ sender: id })
      for (let c of comments) {
        await Comment.findOneAndDelete({ _id: c.id })
      }
      return res.status(StatusCodes.OK).json({
        success: true,
        msg: "Account deleted",
      })
    }
  }
  res.status(StatusCodes.BAD_REQUEST).json({
    success: false,
    msg: "The password you entered is incorrect.",
  })
}

module.exports = {
  loginUser,
  verifyVerificationToken,
  verifyUser,
  registerUser,
  logoutUser,
  getUserInfo,
  updateUserInfo,
  deleteUserAccount,
}
