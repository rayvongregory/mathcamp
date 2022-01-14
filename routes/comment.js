const express = require("express")
const router = express.Router()
const {
  getUserComments,
  getUserComment,
  postComment,
  editComment,
  deleteComment,
  reply,
  editReply,
  deleteReply,
  getAllComments_admin,
} = require("../controllers/comment")

router.route("/").post(postComment).patch(editComment).delete(deleteComment)
router.route("/:id").patch(reply)
router.route("/:token").get(getUserComments)
router.route("/admin").get(getAllComments_admin)

module.exports = router
