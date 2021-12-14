const express = require("express")
const router = express.Router()
const {
  getAllExercises,
  getFilteredExercises,
  getExercise,
  postExercise,
  updateExercise,
  deleteExercise,
} = require("../controllers/exercise")

router.route("/").post(postExercise)
router.route("/:gr").get(getAllExercises)

router
  .route("/id/:id")
  .get(getExercise)
  .patch(updateExercise)
  .delete(deleteExercise)

module.exports = router
