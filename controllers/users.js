require("dotenv").config()
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const { StatusCodes } = require("http-status-codes")

const getAllUsers = async (req, res) => {
  //only admin should be able to do this
  console.log(req)
  res.send("hopefully getting all users")
}

const getUser = async (req, res) => {
  //a user should only be about to get themselves
  const { token } = req.params
  let email = jwt.decode(token).email //! decode does not verify, nor does it require the secret string
  const user = await User.findOne({ email })
  if (!user) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "No user user" })
  }

  let { name, displayName, contactEmail } = user
  res.status(StatusCodes.OK).json({
    fname: name.split(" ")[0],
    lname: name.split(" ")[1],
    dname: displayName,
    email,
    cemail: contactEmail,
  })
}

const updateUser = async (req, res) => {
  //a user should only be able to get themselves
  const { token } = req.params
  let em = jwt.decode(token).email //! decode does not verify, nor does it require the secret string
  const user = await User.findOne({ email: em })
  if (!user) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "No such user" })
  }
  const { name, displayName, email, currentPassword, newPassword } = req.body
  if (name || displayName) {
    user.name = name || user.name
    user.displayName = displayName || user.displayName
    await user.save()
    const accessToken = user.generateAccessToken()
    return res
      .status(StatusCodes.OK)
      .json({ accessToken, msg: "Name(s) updated" })
  }

  if (email) {
    let otherUser = await User.findOne({ email })
    if (otherUser && otherUser.id !== user.id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "There is already an account associated with this email address.",
      })
    }
    //! We should really be sending an email to the given email address for the user to confirm...
    user.email = email
    await user.save()
    const accessToken = user.generateAccessToken()
    return res
      .status(StatusCodes.OK)
      .json({ accessToken, msg: "Email updated" })
  }

  if (currentPassword && newPassword) {
    const match = await user.matchPasswords(currentPassword)
    if (!match) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Incorrect password. Please try again." })
    }
    user.password = newPassword
    await user.hashPassword()
    await user.save()
    return res.status(StatusCodes.OK).json({ msg: "Password updated" })
  }
}

const deleteUser = async (req, res) => {
  //when user decides to delete their account
  const { token } = req.params
  const { pwd } = req.body
  console.log(req.body)
  let email = jwt.decode(token).email //! decode does not verify, nor does it require the secret string
  const user = await User.findOne({ email })
  if (!user) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "No user user" })
  }
  if (pwd) {
    const match = await user.matchPasswords(pwd)
    if (match) {
      let a = await User.findOneAndDelete({ email })
      user.removeRefreshToken()
      return res.status(StatusCodes.OK).json({
        success: true,
        a,
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
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
}
