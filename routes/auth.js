const express = require("express")
const router = express.Router()
const { loginUser, registerUser, logoutUser } = require("../controllers/auth")

router.route("/login").post(loginUser)
router.route("/register").post(registerUser)
router.route("/logout").patch(logoutUser)

module.exports = router
