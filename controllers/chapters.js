const { StatusCodes } = require("http-status-codes")
const Chapter = require("../models/Chapter")

const newChapter = async (req, res) => {
  let chapter = await Chapter.findOne(req.body)
  if (chapter) {
    console.log(chapter)
    return res.json("already got it")
  }
  chapter = new Chapter(req.body)
  await chapter.save()
  res.json({ msg: "new chapter" })
}

const getAllChapters = async (req, res) => {
  const _seven = await Chapter.find({ gr_lvl: "7" }, "title sections").sort({
    "title.number": 1,
    "sections": 1,
  })
  const _eight = await Chapter.find({ gr_lvl: "8" }, "title sections").sort({
    "title.number": 1,
    "sections": 1,
  })
  const _alg = await Chapter.find({ gr_lvl: "alg" }, "title sections").sort({
    "title.number": 1,
    "sections": 1,
  })
  const _geo = await Chapter.find({ gr_lvl: "geo" }, "title sections").sort({
    "title.number": 1,
    "sections": 1,
  })
  const _p_s = await Chapter.find({ gr_lvl: "p_s" }, "title sections").sort({
    "title.number": 1,
    "sections": 1,
  })
  const _alg2 = await Chapter.find({ gr_lvl: "alg2" }, "title sections").sort({
    "title.number": 1,
    "sections": 1,
  })
  const _pc = await Chapter.find({ gr_lvl: "pc" }, "title sections").sort({
    "title.number": 1,
    "sections": 1,
  })
  const _calc = await Chapter.find({ gr_lvl: "calc" }, "title sections").sort({
    "title.number": 1,
    "sections": 1,
  })
  const _calc2 = await Chapter.find({ gr_lvl: "calc2" }, "title sections").sort(
    { "title.number": 1, "sections": 1 }
  )
  res
    .status(StatusCodes.OK)
    .json({ _seven, _eight, _alg, _geo, _p_s, _alg2, _pc, _calc, _calc2 })
}

module.exports = { getAllChapters, newChapter }
