const express = require("express")
const router = express.Router()
const { getResource, getAllResources } = require("../controllers/resource")

router.route("/").get(getAllResources)
router.route("/:id").get(getResource)

module.exports = router
