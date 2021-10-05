const { StatusCodes } = require("http-status-codes")
const Lesson = require("../models/Lesson")
const Practice = require("../models/Practice")

const getAllDrafts = async (req, res) => {
  const lessons = await Lesson.find({ status: "draft" }, "id title")
  const practices = await Practice.find({ status: "draft" }, "id title")
  res.status(StatusCodes.OK).json({ lessons, practices })
}

module.exports = getAllDrafts
