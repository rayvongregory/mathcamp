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

router.route("/").post(postComment).patch(editComment)
router.route("/:id").patch(reply).delete(deleteComment)
router.route("/:id/reply/:num").patch(editReply).delete(deleteReply)
router.route("/:token").get(getUserComments)
router.route("/admin/:id").get(verifyId, getComment_admin)

module.exports = router
