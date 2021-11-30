const express = require("express")
const router = express.Router()
const {
  getAllLessons,
  getFilteredLessons,
  getLesson,
  postLesson,
  updateLesson,
  deleteLesson,
} = require("../controllers/lessons")
const authenticationMiddleware = require("../middleware/auth")

// router.route("/").get(getAllLessons).post(authenticationMiddleware, postLesson)
router.route("/").post(postLesson)
router.route("/:gr").get(getAllLessons)
router.route("/:gr/:chapter").get(getFilteredLessons)

router.route("/:id").get(getLesson).patch(updateLesson).delete(deleteLesson)
// .patch(authenticationMiddleware, updateLesson)
// .delete(authenticationMiddleware, deleteLesson)

module.exports = router
