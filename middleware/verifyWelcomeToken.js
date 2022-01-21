const jwt = require("jsonwebtoken")

const verifyWelcomeToken = (req, res, next) => {
  const { welcomeToken } = req.signedCookies
  try {
    jwt.verify(welcomeToken, process.env.JWT_SECRET)
    next()
  } catch (err) {
    res.cookie("welcomeToken", " ", { maxAge: 0 })
    res.redirect("/login")
  }
}

module.exports = verifyWelcomeToken
