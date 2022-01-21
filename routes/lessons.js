const express = require("express")
const router = express.Router()
const {
  getAllLessons,
  getLesson,
  postLesson,
  updateLesson,
  deleteLesson,
} = require("../controllers/lessons")
const { isAdmin, handleUnexpectedRole } = require("../middleware/verifyRole")

router.route("/").post(isAdmin, handleUnexpectedRole, postLesson)
router.route("/:gr").get(getAllLessons)
router
  .route("/id/:id")
  .get(getLesson)
  .patch(isAdmin, handleUnexpectedRole, updateLesson)
  .delete(isAdmin, handleUnexpectedRole, deleteLesson)

module.exports = router
