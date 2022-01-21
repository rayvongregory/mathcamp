const express = require("express")
const router = express.Router()
const {
  getAllExercises,
  getExercise,
  postExercise,
  updateExercise,
  deleteExercise,
} = require("../controllers/exercise")
const { isAdmin, handleUnexpectedRole } = require("../middleware/verifyRole")

router.route("/").post(isAdmin, handleUnexpectedRole, postExercise)
router.route("/:gr").get(getAllExercises)
router
  .route("/id/:id")
  .get(getExercise)
  .patch(isAdmin, handleUnexpectedRole, updateExercise)
  .delete(isAdmin, handleUnexpectedRole, deleteExercise)

module.exports = router
