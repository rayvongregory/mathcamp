const express = require("express")
const router = express.Router()
const authenticationMiddleware = require("../middleware/auth")

router.route("/").get((req, res, next) => {
  res.render("pages/create-pages/drafts", {
    msg: "Continue editing a resource",
    title: "Drafts",
    bannerTitle: "Drafts",
  })
})
router.route("/lesson/:id").get((req, res, next) => {
  res.render("pages/create-pages/create_lesson", {
    type: "lesson",
    title: "Draft Lesson",
    bannerTitle: "Draft Lesson",
  })
})
router.route("/exercise/:id").get((req, res, next) => {
  res.render("pages/create-pages/create_exercise", {
    type: "practice",
    title: "Draft Exercise",
    bannerTitle: "Draft Exercise",
  })
})

module.exports = router
