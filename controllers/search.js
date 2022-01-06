const Lesson = require("../models/Lesson")
const Exercise = require("../models/Exercise")
const { StatusCodes } = require("http-status-codes")
const { ObjectId } = require("mongoose").Types

const search = async (req, res) => {
  let {
    params: { query },
  } = req
  let results = []
  // let results = [{ _id: new ObjectId("61bb29c670cea83f8c3643ca") }]
  query = query.split("+")
  console.log(query)
  for (let q of query) {
    try {
      let regex = new RegExp(q, "i")
      let eResults = await Exercise.find(
        { tags: regex, status: "published" },
        "id title type hits"
      ).sort({ hits: 1, title: 1 })
      let lResults = await Lesson.find(
        { tags: regex, status: "published" },
        "id title type hits"
      ).sort({ hits: 1, title: 1 })
      if (eResults.length !== 0) {
        if (results.length === 0) {
          results = [...eResults]
        } else {
          addNewResources(results, eResults)
        }
      }
      if (lResults.length !== 0) {
        if (results.length === 0) {
          results = [...lResults]
        } else {
          addNewResources(results, lResults)
        }
      }
    } catch (err) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Query must not contain special regex characters" })
    }
  }
  results = sortByHits(results)
  num = results.length
  res.status(StatusCodes.OK).json({ results, num })
}

const addNewResources = (list, newResources) => {
  let listIds = []
  let newResourceIds = []
  for (let i of list) {
    listIds.push(String(i._id))
  }
  for (let i of newResources) {
    newResourceIds.push(String(i._id))
  }
  for (let i = 0; i < newResourceIds.length; i++) {
    if (!listIds.includes(newResourceIds[i])) {
      listIds.push(newResourceIds[i])
      list.push(newResources[i])
    }
  }
}

const sortByHits = (list) => {
  console.log(list)
  for (let i = 1; i < list.length; i++) {
    if (list[i].hits < list[i - 1].hits) {
      let item = list[i]
      list.splice(i, 1)
      list.splice(i - 1, 0, item)
      i -= 2
    }
  }
  return list.reverse()
}

module.exports = search
