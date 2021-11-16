const express = require("express")
const router = express.Router()
const {
  getAllPosts,
  getPost,
  createPost,
  editPost,
  deletePost,
} = require("../controllers/create")
const authenticationMiddleware = require("../middleware/auth")

// router.use(authenticationMiddleware)
//! This should (keyword) run the authentication middleware for all of the following routes
router.route("/").get((req, res, next) => {
  res.render("pages/drafts", {
    msg: "Continue editing a resource",
    title: "Drafts",
    bannerTitle: "Drafts",
  })
})
router.route("/lesson/:id").get((req, res, next) => {
  res.render("pages/create_lesson", {
    type: "lesson",
    title: "Draft Lesson",
    bannerTitle: "Draft Lesson",
  })
})
router.route("/exercise/:id").get((req, res, next) => {
  res.render("pages/create_exercise", {
    type: "practice",
    title: "Draft Exercise",
    bannerTitle: "Draft Exercise",
  })
})

module.exports = router
