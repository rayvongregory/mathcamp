require("dotenv")
const User = require("../models/User")
const { StatusCodes } = require("http-status-codes")
const jwt = require("jsonwebtoken")

const loginUser = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Invalid credentials, please try again." })
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
  // console.log(token, time)
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

const registerUser = async (req, res) => {
  const { email } = req.body
  let user = await User.findOne({ email })
  if (user) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: `There is already an account associated with this email.` })
  }

  user = new User(req.body)
  //! We should really be sending an email to the given email address for the user to confirm...
  await user.hashPassword()
  user.createDisplayName()
  user.getAvatar()
  // user.createContactEmail()
  const refreshToken = user.generateRefreshToken()
  const accessToken = user.generateAccessToken()
  await user.save()
  res.status(StatusCodes.OK).json({
    accessToken,
    refreshToken,
    msg: `Nice to meet you, ${user.name.split(" ", 2)[0]}.`,
  })
}

module.exports = { loginUser, registerUser, logoutUser }
