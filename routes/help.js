const express = require("express")
const router = express.Router()
const {
  getAllHelp,
  getHelp,
  postHelp,
  updateHelp,
  deleteHelp,
} = require("../controllers/help")

router.route("/").get(getAllHelp).post(postHelp)
router.route("/:id").get(getHelp).patch(updateHelp).delete(deleteHelp)

module.exports = router
