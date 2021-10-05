const express = require("express")
const router = express.Router()
const {
  getAllPractice,
  getPractice,
  postPractice,
  updatePractice,
  deletePractice,
} = require("../controllers/practice")

router.route("/").get(getAllPractice).post(postPractice)
router
  .route("/:id")
  .get(getPractice)
  .patch(updatePractice)
  .delete(deletePractice)

module.exports = router
