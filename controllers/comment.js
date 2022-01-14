const Comment = require("../models/Comment")
const User = require("../models/User")
const { StatusCodes } = require("http-status-codes")
const jwt = require("jsonwebtoken")

const getUserComments = async (req, res) => {
  const { token } = req.params
  const { email } = jwt.decode(token)
  let user = await User.findOne({ email }, "id")
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "No such user" })
  }
  const comments = await Comment.find({ sender: user }, "comment replies").sort(
    { "comment.sentAt": -1 }
  )
  res.status(StatusCodes.OK).json({ comments })
}

const getUserComment = (req, res) => {}

const postComment = async (req, res) => {
  const { token, question, details } = req.body
  const { email } = jwt.decode(token)
  let user = await User.findOne({ email }, "id")
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "No such user" })
  }
  const newComment = new Comment({
    sender: user,
    comment: { question, details },
  })
  await newComment.save()
  res.status(StatusCodes.OK).json({ newComment })
}

const editComment = async (req, res) => {
  // maybe just want to verify the token instead of finding the user because that really doesn't matter for this
  const { token, id, details } = req.body
  const comment = await Comment.findById(id)
  if (!comment) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "No such comment" })
  }
  comment.comment.details = details
  await comment.save()
  res.status(StatusCodes.OK).json({ msg: "Comment patched" })
}

const deleteComment = (req, res) => {}

const reply = async (req, res) => {
  const { id } = req.params
  const comment = await Comment.findById(id)
  if (!comment) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "No such comment" })
  }
  const { token, reply } = req.body
  const { role: sender } = jwt.decode(token)
  let { replies } = comment
  replies.push({ sender, reply })
  comment.status = "new"
  await comment.save()
  res.status(StatusCodes.OK).json({ sender, reply })
}

const editReply = (req, res) => {}

const deleteReply = (req, res) => {}

const getAllComments_admin = (req, res) => {}

module.exports = {
  getUserComments,
  getUserComment,
  postComment,
  editComment,
  deleteComment,
  reply,
  editReply,
  deleteReply,
  getAllComments_admin,
}
