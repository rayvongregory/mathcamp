const Exercise = require("../models/Exercise")
const { StatusCodes } = require("http-status-codes")

const getAllExercises = async (req, res) => {
  console.log(req.body)
  res.send("hopefully getting all practice")
}

const getExercise = async (req, res) => {
  const { id } = req.params
  const exercise = await Exercise.findById(id)
  if (!exercise) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `Exercise with id ${id} does not exist.` })
  }
  const { title, tags, subject, chapter, section, problems, usedPIDs } =
    exercise
  res
    .status(StatusCodes.OK)
    .json({ title, tags, subject, chapter, section, problems, usedPIDs })
}

const postExercise = async (req, res) => {
  let { title } = req.body
  let exercise = await Exercise.findOne({ title })

  if (exercise) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "An exercise with this title already exists. Please choose another name for this exercise.",
    })
  }

  exercise = new Exercise(req.body)
  await exercise.save()
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Exercise saved successfully", id: exercise.id })
}

const updateExercise = async (req, res) => {
  const { id } = req.params
  let exercise = await Exercise.findById(id)
  if (!exercise) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: `Exercise with id ${id} does not exist.` })
  }

  const { title } = req.body
  exercise = await Exercise.findOne({ title })
  if (exercise && !(exercise.id === id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Exercise with this title already exists" })
  }

  await Exercise.findByIdAndUpdate(id, req.body)
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Exercise saved successfully", id })
}

const deleteExercise = async (req, res) => {
  let { id } = req.params
  let lesson = await Exercise.findOneAndDelete({ _id: id }, (err, result) => {
    if (err) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: `Exercise with id ${id} does not exist.` })
    } else {
      return res
        .status(StatusCodes.OK)
        .json({ msg: `Exercise with id ${id} was deleted.` })
    }
  })
}
module.exports = {
  getAllExercises,
  getExercise,
  postExercise,
  updateExercise,
  deleteExercise,
}
