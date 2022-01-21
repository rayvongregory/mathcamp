const express = require("express")
const router = express.Router()

const { getNameAndRole } = require("../controllers/users")
router.route("/").get(getNameAndRole)

module.exports = router
