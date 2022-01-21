const express = require("express")
const router = express.Router()
const {
  getUserComments,
  postComment,
  editComment,
  deleteComment,
  reply,
  editReply,
  deleteReply,
  getComment_admin,
} = require("../controllers/comment")

const verifyId = require("../middleware/verifyObjectId")
const {
  isUser,
  isAdmin,
  isLoggedIn,
  handleUnexpectedRole,
} = require("../middleware/verifyRole")

router
  .route("/")
  .get(isUser, handleUnexpectedRole, getUserComments)
  .post(isLoggedIn, handleUnexpectedRole, postComment)
  .patch(isLoggedIn, handleUnexpectedRole, editComment)
router
  .route("/:id")
  .patch(isLoggedIn, handleUnexpectedRole, reply)
  .delete(isLoggedIn, handleUnexpectedRole, deleteComment)
router
  .route("/:id/reply/:num")
  .patch(isLoggedIn, handleUnexpectedRole, editReply)
  .delete(isLoggedIn, handleUnexpectedRole, deleteReply)
router
  .route("/admin/:id")
  .get(verifyId, isAdmin, handleUnexpectedRole, getComment_admin)

module.exports = router
