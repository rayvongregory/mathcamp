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
  const { title, tags, text } = practice
  res.status(StatusCodes.OK).json({ title, tags, text })
}

const postExercise = async (req, res) => {
  let exercise = new Exercise(req.body)
  console.log(req.body)
  console.log("here")

  res.send("hopefully posting an exercise")
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
  res.send("hopefully deleting an exercise")
}
module.exports = {
  getAllExercises,
  getExercise,
  postExercise,
  updateExercise,
  deleteExercise,
}
