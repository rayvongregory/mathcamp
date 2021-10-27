const express = require("express")
const router = express.Router()
const {
  getAllExercises,
  getExercise,
  postExercise,
  updateExercise,
  deleteExercise,
} = require("../controllers/exercise")

router.route("/").get(getAllExercises).post(postExercise)
router
  .route("/:id")
  .get(getExercise)
  .patch(updateExercise)
  .delete(deleteExercise)

module.exports = router
