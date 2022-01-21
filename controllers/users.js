require("dotenv").config()
const { StatusCodes } = require("http-status-codes")

const getNameAndRole = (req, res) => {
  const { role, displayName } = req.body
  res.status(StatusCodes.OK).json({ role, displayName })
}

module.exports = { getNameAndRole }
