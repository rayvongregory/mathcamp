const express = require("express")
const router = express.Router()
const {
  loginUser,
  verifyId,
  verifyUser,
  registerUser,
  logoutUser,
} = require("../controllers/auth")

router.route("/login").post(loginUser)
router.route("/register").post(registerUser)
router.route("/register/:id").patch(verifyId, verifyUser)
router.route("/logout").patch(logoutUser)

module.exports = router
