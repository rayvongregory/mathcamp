const Practice = require("../models/Practice")
const { StatusCodes } = require("http-status-codes")

const getAllPractice = async (req, res) => {
  console.log(req.body)
  res.send("hopefully getting all practice")
}

const getPractice = async (req, res) => {
  const { id } = req.params
  const practice = await Practice.findById(id)
  if (!practice) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `Practice with id ${id} does not exist.` })
  }
  const { title, tags, text } = practice
  res.status(StatusCodes.OK).json({ title, tags, text })
}

const postPractice = async (req, res) => {
  console.log(req.body)
  console.log("here")

  res.send("hopefully posting a practice")
}

const updatePractice = async (req, res) => {
  const { id } = req.params
  let practice = await Practice.findById(id)
  if (!practice) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: `Practice with id ${id} does not exist.` })
  }

  const { title } = req.body
  practice = await Practice.findOne({ title })
  if (practice && !(practice.id === id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Practice with this title already exists" })
  }

  await Practice.findByIdAndUpdate(id, req.body)
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Practice saved successfully", id })
}

const deletePractice = async (req, res) => {
  res.send("hopefully deleting a practice")
}
module.exports = {
  getAllPractice,
  getPractice,
  postPractice,
  updatePractice,
  deletePractice,
}
