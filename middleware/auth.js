require("dotenv").config()
const jwt = require("jsonwebtoken")
// const { UnauthenticatedError } = require("../errors")

const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization
  console.log(7, Date.now())
  // const token = authHeader && authHeader.split(" ")[1]
  // if (token === null) {
  //   return res.sendStatus(401)
  // }

  // jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
  //   if (err)
  //     return res.sendStatus(403).json({ msg: "Token cannot be verified" })
  //   req.user = user
  next()
  // })
  // if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //   // throw new UnauthenticatedError("No token provided")
  // }

  // const token = authHeader.split(" ")[1]

  // try {
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET)
  //   const { id, username } = decoded
  //   req.user = { id, username }
  // next()
  // } catch (error) {
  // throw new UnauthenticatedError("Not authorized to access this route")
  // }
}

module.exports = authenticationMiddleware
