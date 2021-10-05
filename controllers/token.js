require("dotenv").config()
const User = require("../models/User")
const jwt = require("jsonwebtoken")
const { StatusCodes } = require("http-status-codes")

const getDisplayName = async (req, res) => {
  const { token } = req.params
  const decoded = jwt.decode(token, process.env.JWT_ACCESS_SECRET)
  let user = await User.findOne({ email: decoded.email })
  if (user.role !== decoded.role) {
    return res
      .status(StatusCodes.CONFLICT)
      .json({ msg: "Role provided does not match saved role." })
  }
  res.status(StatusCodes.OK).json({
    displayName: decoded.displayName,
    role: decoded.role,
    avatar: decoded.avatar,
  })
}

module.exports = getDisplayName
