require("dotenv").config()
const User = require("../models/User")
const jwt = require("jsonwebtoken")
const { StatusCodes } = require("http-status-codes")

const verifyAccessToken = async (req, res, next) => {
  let { accessToken, refreshToken } = req.signedCookies
  if (!refreshToken) {
    next()
  } else {
    try {
      let { id } = jwt.verify(accessToken, process.env.JWT_SECRET)
      let { role, displayName } = await User.findById(id, "role displayName")
      req.body.role = role
      req.body.displayName = displayName
      req.body.userId = id
      next()
    } catch (err) {
      // accessToken expired
      try {
        let { id, key } = jwt.verify(refreshToken, process.env.JWT_SECRET)
        let user = await User.findById(id, "role displayName")
        await user.removeRedisToken(key)
        let refreshTokenKey = await user.generateRedisToken(
          id,
          req.ip,
          req.headers["user-agent"]
        )
        const { accessToken: newAT, refreshToken: newRT } = user.generateTokens(
          id,
          refreshTokenKey
        )
        res.cookie("accessToken", newAT, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          signed: true,
          maxAge: 1000 * 60 * 15,
          path: "/",
          SameSite: "none",
        })
        res.cookie("refreshToken", newRT, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          signed: true,
          maxAge: 1000 * 60 * 60 * 24 * 7,
          path: "/",
          SameSite: "none",
        })
        req.body.role = user.role
        req.body.displayName = user.displayName
        req.body.userId = id
        next()
      } catch (err) {
        // refresh token expired
        let { id, key } = jwt.decode(refreshToken)
        let user = await User.findById(id)
        await user.removeRedisToken(key)
        res.cookie("accessToken", "", {
          httpOnly: true,
          expires: new Date(Date.now()),
        })
        res.cookie("refreshToken", "", {
          httpOnly: true,
          expires: new Date(Date.now()),
        })
        next()
        // removing cookies should log out the user
      }
    }
  }
}

module.exports = verifyAccessToken
