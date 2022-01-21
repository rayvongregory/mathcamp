const express = require("express")
const router = express.Router()
const { getAllChapters, newChapter } = require("../controllers/chapters")
const { isAdmin, handleUnexpectedRole } = require("../middleware/verifyRole")

router
  .route("/")
  .get(getAllChapters)
  .post(isAdmin, handleUnexpectedRole, newChapter)

module.exports = router
