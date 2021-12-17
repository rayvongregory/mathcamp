const Lesson = require("../models/Lesson")
const { StatusCodes } = require("http-status-codes")

const getAllLessons = async (req, res) => {
  const { gr } = req.params
  const publishedLessons = await Lesson.find(
    // { status: "published", subject: gr },
    { subject: gr }
    // "id title subject chapter section"
  )
  res.status(StatusCodes.OK).json({ publishedLessons })
}

const getLesson = async (req, res) => {
  const { id } = req.params
  let lesson = await Lesson.findById(id)
  if (!lesson) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `Lesson with id ${id} does not exist.` })
  }
  const { title, subject, chapter, section, tags, html, css, js } = lesson
  res
    .status(StatusCodes.OK)
    .json({ title, subject, chapter, section, tags, html, css, js })
}

//! only admin can create, update. or delete

const postLesson = async (req, res) => {
  const { title } = req.body
  let lesson = await Lesson.findOne({ title })
  if (lesson) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "A lesson with this title already exists" })
  }
  lesson = new Lesson(req.body)
  await lesson.save()
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Lesson saved successfully", id: lesson.id })
}

const updateLesson = async (req, res) => {
  const { id } = req.params
  let lesson = await Lesson.findById(id)
  if (!lesson) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: `Lesson with id ${id} does not exist.` })
  }
  const { title } = req.body
  lesson = await Lesson.findOne({ title })
  if (lesson && !(lesson.id === id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Lesson with this title already exists" })
  }
  await Lesson.findByIdAndUpdate(id, req.body)
  res.status(StatusCodes.CREATED).json({ msg: "Lesson saved successfully", id })
}

const deleteLesson = async (req, res) => {
  let { id } = req.params
  let lesson = await Lesson.findOneAndDelete({ _id: id }, (err, result) => {
    if (err) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: `Lesson with id ${id} does not exist.` })
    } else {
      return res
        .status(StatusCodes.OK)
        .json({ msg: `Lesson with id ${id} was deleted.` })
    }
  })
}
module.exports = {
  getAllLessons,
  getLesson,
  postLesson,
  updateLesson,
  deleteLesson,
}
