const { StatusCodes } = require("http-status-codes")
const Lesson = require("../models/Lesson")
const Exercise = require("../models/Exercise")

const getAllDrafts = async (req, res) => {
  const lessons = await Lesson.find({ status: "draft" }, "id title")
  const exercises = await Exercise.find({ status: "draft" }, "id title")
  res.status(StatusCodes.OK).json({ lessons, exercises })
}

module.exports = getAllDrafts
