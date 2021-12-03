const express = require("express")
const router = express.Router()
const { getRndSubjs, postRndSubj } = require("../controllers/rnd_subj")

router.route("/").get(getRndSubjs).post(postRndSubj)

module.exports = router
