const RndSubj = require("../models/RndSubject")
const { StatusCodes } = require("http-status-codes")

const getRndSubjs = async (req, res) => {
  let rndsubjs = await RndSubj.aggregate().sample(11)
  res.status(StatusCodes.OK).json({ rndsubjs })
}

const postRndSubj = async (req, res) => {
  const { name } = req.body
  console.log(name)
  let rndsubj = await RndSubj.findOne({ name })
  if (rndsubj) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: `Random subject ${name} already exists` })
  }
  rndsubj = new RndSubj({ name })
  await rndsubj.save()
  res.status(StatusCodes.OK).json({ msg: "Random subject successfully saved." })
}
module.exports = { getRndSubjs, postRndSubj }
