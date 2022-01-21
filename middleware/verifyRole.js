const { StatusCodes } = require("http-status-codes")

const isAdmin = (req, res, next) => {
  const { role } = req.body
  if (role !== "admin") {
    req.body.expectedRole = false
  } else {
    req.body.expectedRole = true
  }
  next()
}

const isNotAdmin = (req, res, next) => {
  const { role } = req.body
  if (role === "admin") {
    req.body.expectedRole = false
  } else {
    req.body.expectedRole = true
  }
  next()
}

const isUser = (req, res, next) => {
  const { role } = req.body
  if (role !== "user") {
    req.body.expectedRole = false
  } else {
    req.body.expectedRole = true
  }
  next()
}

const isLoggedIn = (req, res, next) => {
  const { role } = req.body
  if (!role) {
    req.body.expectedRole = false
  } else {
    req.body.expectedRole = true
  }
  next()
}

const isNotLoggedIn = (req, res, next) => {
  const { role } = req.body
  if (role) {
    req.body.expectedRole = false
  } else {
    req.body.expectedRole = true
  }
  next()
}

const handleRedirect = (req, res, next) => {
  const { expectedRole } = req.body
  if (!expectedRole) {
    return res.status(StatusCodes.UNAUTHORIZED).redirect("/")
  }
  next()
}

const handleUnexpectedRole = (req, res, next) => {
  const { expectedRole } = req.body
  if (!expectedRole) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "This user does not have permission to access this route" })
  }
  next()
}

module.exports = {
  isAdmin,
  isNotAdmin,
  isUser,
  isLoggedIn,
  isNotLoggedIn,
  handleRedirect,
  handleUnexpectedRole,
}
