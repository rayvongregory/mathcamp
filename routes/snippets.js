const express = require("express")
const router = express.Router()
const getSnippet = require("../controllers/snippets")

router.route("/:lang/:name").get(getSnippet)

module.exports = router
