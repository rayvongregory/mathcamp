require("dotenv").config()
require("ejs")
const connectDB = require("./db/connect")
const refreshTokens = require("./db/redis-cache")
const lessonsRouter = require("./routes/lessons")
const exercisesRouter = require("./routes/exercise")
const draftsRouter = require("./routes/drafts")
const helpRouter = require("./routes/help")
const authRouter = require("./routes/auth")
const usersRouter = require("./routes/users")
const tokenRouter = require("./routes/token")
const createRouter = require("./routes/create")
const draftRouter = require("./routes/draft")
const chaptersRouter = require("./routes/chapters")

const express = require("express")
const app = express()

app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"))
app.use(express.json({ limit: "200mb" }))
app.use(express.urlencoded({ limit: "200mb", extended: false }))

app.use("/api/v1/lessons", lessonsRouter) //protect this route
app.use("/api/v1/exercises", exercisesRouter) //protect this route
app.use("/api/v1/drafts", draftsRouter) //protect this route
app.use("/api/v1/help", helpRouter)
app.use("/api/v1/token", tokenRouter)
app.use("/api/v1/auth", authRouter) //register, login, logout
app.use("/api/v1/users", usersRouter) // admin only (if you ever decide to flesh this is)
app.use("/api/v1/chapters", chaptersRouter)
app.use("/create", createRouter)
app.use("/drafts", draftRouter)

app.use("/account", (req, res, next) => {
  res.render("pages/auth", {
    title: "Account",
    bannerTitle: "Account",
  })
})

app.use("/delete", (req, res, next) => {
  res.render("pages/auth", {
    title: "Delete",
    bannerTitle: "Account",
  })
})

app.use("/help", (req, res, next) => {
  res.render("pages/help", {
    msg: "Try signing up for a group-tutoring session.",
    title: "Help",
    bannerTitle: "Help",
  })
})
app.use("/learn", (req, res, next) => {
  res.render("pages/learn", {
    msg: "Browse our articles and video lessons.",
    title: "Learn",
    bannerTitle: "Learn",
  })
})
app.use("/login", (req, res, next) => {
  res.render("pages/auth", {
    title: "Login",
    bannerTitle: "Login",
  })
})
app.use("/practice", (req, res, next) => {
  res.render("pages/practice", {
    msg: "Engage in our adaptive learning exercises.",
    title: "Practice",
    bannerTitle: "Practice",
  })
})
app.use("/register", (req, res, next) => {
  res.render("pages/auth", {
    title: "Register",
    bannerTitle: "Register",
  })
})
app.use("/", (req, res, next) => {
  res.render("pages/index", { title: "Home" })
})

// app.use("/draft/exercise", (req, res, next) => {
//   res.sendFile("public/draftpractice.html", { root: __dirname })
// })
// app.use("/create/exercise", (req, res, next) => {
//   res.sendFile("public/createpractice.html", { root: __dirname })
// })

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  connectDB(process.env.MONGO_URI)
  refreshTokens.on("connect", function () {
    console.log("Redis client ready")
  })

  refreshTokens.on("error", function (error) {
    console.error(10, error)
  })
  console.log(`Listening on port ${PORT}`)
})
