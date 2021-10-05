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
  //a user should only be about to get themselves
  const { token } = req.params
  let email = jwt.decode(token).email //! decode does not verify, nor does it require the secret string
  const user = await User.findOne({ email })
  if (!user) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "No user user" })
  }
  const { name, displayName, contactEmail, currentPassword, newPassword } =
    req.body
  if (name || displayName) {
    user.name = name || user.name
    user.displayName = displayName || user.displayName
    await user.save()
    const accessToken = user.generateAccessToken()
    return res.status(StatusCodes.OK).json({ accessToken, msg: "Info updated" })
  }

  if (contactEmail) {
    //! We should really be sending an email to the given email address for the user to confirm...
    user.contactEmail = contactEmail
    await user.save()
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
  }

  res.status(StatusCodes.OK).json({ msg: "Info updated" })
}

const deleteUser = async (req, res) => {
  //when user decides to delete their account
  const { token } = req.params
  let email = jwt.decode(token).email //! decode does not verify, nor does it require the secret string
  const user = await User.findOneAndDelete({ email })
  if (!user) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "No user user" })
  }
  user.removeRefreshToken()
  res.status(StatusCodes.OK).json({ msg: "Account deleted" })
}
module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
}
