const express = require("express")
const router = express.Router()
const getDisplayName = require("../controllers/token")

router.route("/:token").get(getDisplayName)

module.exports = router
