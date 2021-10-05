const express = require("express")
const router = express.Router()
const getAllDrafts = require("../controllers/drafts")

router.route("/").get(getAllDrafts)

module.exports = router
