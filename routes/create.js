const express = require("express")
const router = express.Router()
const {
  getAllPosts,
  getPost,
  createPost,
  editPost,
  deletePost,
} = require("../controllers/create")
// const authenticationMiddleware = require("../middleware/auth")

// router.use(authenticationMiddleware)
//! This should (keyword) run the authentication middleware for all of the following routes
// router.route("/").get(authenticationMiddleware, getAllPosts)
// router.route("/:id").get(getPost).delete(deletePost)
// router.route("/:id/edit").patch(editPost)
// router.route("/create").post(createPost)

router.route("/lesson").get((req, res) => {
  res.render("pages/create-pages/create_lesson", {
    type: "lesson",
    title: "Create Lesson",
    bannerTitle: "Create Lesson",
  })
})

router.route("/exercise").get((req, res) => {
  res.render("pages/create-pages/create_exercise", {
    type: "exercise",
    title: "Create Exercise",
    bannerTitle: "Create Exercise",
  })
})

module.exports = router
