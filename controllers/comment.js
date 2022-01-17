const Comment = require("../models/Comment")
const User = require("../models/User")
const { StatusCodes } = require("http-status-codes")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const ejs = require("ejs")
const path = require("path")
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.user,
    pass: process.env.pass,
  },
})
const file = path.join(__dirname, "../views/pages/new_comment.ejs")

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

const postComment = async (req, res) => {
  const { token, question, details } = req.body
  const { email } = jwt.decode(token)
  let user = await User.findOne({ email }, "id name")
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "No such user" })
  }
  const newComment = new Comment({
    sender: user,
    comment: { question, details },
  })
  await newComment.save()
  const url = `${req.protocol}://${req.get("host")}${req.url}help/admin/${
    newComment.id
  }`
  const name = user.name.split(" ")[0]
  const data = await ejs.renderFile(file, {
    name,
    action: "posted a new comment",
    url,
  })
  transporter.sendMail({
    from: user.email,
    to: '"Math Camp" <support@mathcamp.com>',
    subject: `${name} has posted a new comment.`,
    text: `Use the link below to see what they said.\n\n\r ${url}`,
    html: data,
  })
  res.status(StatusCodes.OK).json({ newComment })
}

const editComment = async (req, res) => {
  // maybe just want to verify the token instead of finding the user because that really doesn't matter for this
  const { token, id, details } = req.body
  const { email } = jwt.decode(token)
  let user = await User.findOne({ email }, "id name")
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "No such user" })
  }
  const comment = await Comment.findById(id)
  if (!comment) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "No such comment" })
  }
  comment.comment.details = details
  await comment.save()
  const url = `${req.protocol}://${req.get("host")}${req.url}help/admin/${
    comment.id
  }`
  const name = user.name.split(" ")[0]
  const data = await ejs.renderFile(file, {
    name,
    action: "updated their comment",
    url,
  })
  transporter.sendMail({
    from: user.email,
    to: '"Math Camp" <support@mathcamp.com>',
    subject: `${name} has updated their comment.`,
    text: `Use the link below to see what they said.\n\n\r ${url}`,
    html: data,
  })
  res.status(StatusCodes.OK).json({ msg: "Comment patched" })
}

const deleteComment = async (req, res) => {
  const { id } = req.params
  await Comment.findByIdAndDelete(id, (err, doc) => {
    if (err) {
      res.status(StatusCodes.NOT_FOUND).json({ msg: "No such comment" })
    } else {
      res.status(StatusCodes.OK).json({ msg: "Comment deleted" })
    }
  })
}

const reply = async (req, res) => {
  const { id } = req.params
  const { token, reply } = req.body
  const { email } = jwt.decode(token)
  let user = await User.findOne({ email }, "id name")
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "No such user" })
  }
  const comment = await Comment.findById(id)
  if (!comment) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "No such comment" })
  }
  const { role: sender } = jwt.decode(token)
  let { replies } = comment
  replies.push({ sender, reply })
  await comment.save()
  switch (sender) {
    case "admin":
      const { email } = await User.findById(comment.sender)
      let url = `${req.protocol}://${req.get("host")}/help/${id}`
      let data = await ejs.renderFile(file, {
        name: "admin@MC",
        action: "responded to your comment",
        url,
      })
      transporter.sendMail({
        from: '"Math Camp" <support@mathcamp.com>',
        to: email,
        subject: `New message from Math Camp`,
        text: `Use the link below to see what they said.\n\n\r ${url}`,
        html: data,
      })
      break
    default:
      let u = `${req.protocol}://${req.get("host")}${req.url}help/admin/${
        comment.id
      }`
      const name = user.name.split(" ")[0]
      let d = await ejs.renderFile(file, {
        name,
        action: "added a response to their comment",
        url: u,
      })
      transporter.sendMail({
        from: user.email,
        to: '"Math Camp" <support@mathcamp.com>',
        subject: `${name} just added a response to their comment`,
        text: `Use the link below to see what they said.\n\n\r ${u}`,
        html: d,
      })
      break
  }
  res.status(StatusCodes.OK).json({ sender, reply })
}

const editReply = async (req, res) => {
  const { id, num } = req.params
  const { token, reply } = req.body
  const { email } = jwt.decode(token)
  let user = await User.findOne({ email }, "id name role")
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "No such user" })
  }
  // use token for validation... probably could use some middleware for that
  const comment = await Comment.findById(id)
  if (!comment) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "No such comment" })
  }
  const { replies } = comment
  const { role: sender } = user
  if (!replies[num]) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "No such reply" })
  }
  comment.replies[num].reply = reply
  await comment.save()
  switch (sender) {
    case "admin":
      const { email } = await User.findById(comment.sender)
      let url = `${req.protocol}://${req.get("host")}/help/${id}`
      let data = await ejs.renderFile(file, {
        name: "admin@MC",
        action: "updated their response to your comment",
        url,
      })
      transporter.sendMail({
        from: '"Math Camp" <support@mathcamp.com>',
        to: email,
        subject: `New message from Math Camp`,
        text: `Use the link below to see what they said.\n\n\r ${url}`,
        html: data,
      })
      break
    default:
      let u = `${req.protocol}://${req.get("host")}/help/admin/${comment.id}`
      const name = user.name.split(" ")[0]
      let d = await ejs.renderFile(file, {
        name,
        action: "updated a response on their comment",
        url: u,
      })
      transporter.sendMail({
        from: user.email,
        to: '"Math Camp" <support@mathcamp.com>',
        subject: `${name} just updated a response on their comment`,
        text: `Use the link below to see what they said.\n\n\r ${u}`,
        html: d,
      })
      break
  }
  res.status(StatusCodes.OK).json({ msg: "Reply edited" })
}

const deleteReply = async (req, res) => {
  const { id, num } = req.params
  const { token } = req.body
  // use token for validation... probably could use some middleware for that
  const comment = await Comment.findById(id)
  if (!comment) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "No such comment" })
  }
  const { replies } = comment
  if (!replies[num]) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "No such reply" })
  }
  comment.replies.splice(num, 1)
  await comment.save()
  res.status(StatusCodes.OK).json({ msg: "Reply deleted" })
}

const getComment_admin = async (req, res) => {
  const { id } = req.params
  try {
    await Comment.findById(id, async (err, doc) => {
      if (err) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ msg: "No such comment" })
      }
      let { displayName } = await User.findById(doc.sender, "displayName")
      res.status(StatusCodes.OK).json({ thread: doc, displayName })
    })
  } catch (err) {}
}

module.exports = {
  getUserComments,
  postComment,
  editComment,
  deleteComment,
  reply,
  editReply,
  deleteReply,
  getComment_admin,
}
