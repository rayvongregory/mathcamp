const express = require("express")
const router = express.Router()
const {
  loginUser,
  verifyUser,
  registerUser,
  logoutUser,
} = require("../controllers/auth")
const verifyId = require("../middleware/verifyObjectId")

router.route("/login").post(loginUser)
router.route("/register").post(registerUser)
router.route("/register/:email").patch(verifyUser)
router.route("/logout").patch(logoutUser)

module.exports = router
