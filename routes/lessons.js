const express = require("express")
const router = express.Router()
const {
  getAllLessons,
  getLesson,
  postLesson,
  updateLesson,
  deleteLesson,
} = require("../controllers/lessons")
const authenticationMiddleware = require("../middleware/auth")

// router.route("/").get(getAllLessons).post(authenticationMiddleware, postLesson)
router.route("/").get(getAllLessons).post(postLesson)

router.route("/:id").get(getLesson).patch(updateLesson).delete(deleteLesson)
// .patch(authenticationMiddleware, updateLesson)
// .delete(authenticationMiddleware, deleteLesson)

module.exports = router
