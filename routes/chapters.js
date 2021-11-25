const express = require("express")
const router = express.Router()
const { getAllChapters, newChapter } = require("../controllers/chapters")

router.route("/").get(getAllChapters).post(newChapter)

module.exports = router
