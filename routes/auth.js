const express = require("express")
const router = express.Router()
const {
  loginUser,
  verifyUser,
  verifyVerificationToken,
  registerUser,
  getUserInfo,
  updateUserInfo,
  deleteUserAccount,
  logoutUser,
} = require("../controllers/auth")
const {
  isLoggedIn,
  isNotLoggedIn,
  handleUnexpectedRole,
} = require("../middleware/verifyRole")

router.route("/login").post(isNotLoggedIn, handleUnexpectedRole, loginUser)
router
  .route("/register")
  .post(isNotLoggedIn, handleUnexpectedRole, registerUser)
router.route("/register/:email").patch(verifyVerificationToken, verifyUser)
router.route("/logout").patch(isLoggedIn, handleUnexpectedRole, logoutUser)
router
  .route("/account")
  .get(isLoggedIn, handleUnexpectedRole, getUserInfo)
  .patch(isLoggedIn, handleUnexpectedRole, updateUserInfo)
  .delete(isLoggedIn, handleUnexpectedRole, deleteUserAccount)
module.exports = router
