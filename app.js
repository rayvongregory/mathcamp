require("dotenv").config()
require("ejs")
const connectDB = require("./db/connect")
const refreshTokens = require("./db/redis-cache")
const lessonsRouter = require("./routes/lessons")
const learnRouter = require("./routes/resource")
const practiceRouter = require("./routes/resource")
const exercisesRouter = require("./routes/exercise")
const draftsRouter = require("./routes/drafts")
const helpRouter = require("./routes/help")
const searchRouter = require("./routes/search")
const authRouter = require("./routes/auth")
const usersRouter = require("./routes/users")
const tokenRouter = require("./routes/token")
const createRouter = require("./routes/create")
const draftRouter = require("./routes/draft")
const chaptersRouter = require("./routes/chapters")
const snippetsRouter = require("./routes/snippets")
const express = require("express")
const expressFileUpload = require("express-fileupload")
const app = express()

app.use(express.static(__dirname + "/public"))
app.use(express.urlencoded({ limit: "200mb", extended: false }))
app.use(express.json({ limit: "200mb" }))
app.use(expressFileUpload())
app.set("view engine", "ejs")

app.use("/api/v1/lessons", lessonsRouter) //protect this route
app.use("/api/v1/exercises", exercisesRouter) //protect this route
app.use("/api/v1/drafts", draftsRouter) //protect this route
app.use("/api/v1/help", helpRouter)
app.use("/api/v1/search", searchRouter)
app.use("/api/v1/token", tokenRouter)
app.use("/api/v1/auth", authRouter) //register, login, logout
app.use("/api/v1/users", usersRouter) // admin only (if you ever decide to flesh this out)
app.use("/api/v1/chapters", chaptersRouter)
app.use("/api/v1/snippets", snippetsRouter)
app.use("/create", createRouter)
app.use("/drafts", draftRouter)
app.use("/learn", learnRouter)
app.use("/practice", practiceRouter)
app.use("/mathjax", express.static(__dirname + "/node_modules/mathjax"))
app.use("/mathtype", express.static(__dirname + "/node_modules/@wiris"))
app.use("/codemirror", express.static(__dirname + "/node_modules/codemirror"))
app.use("/particlesjs", express.static(__dirname + "/node_modules/particlesjs"))
app.use("/account", (req, res, next) => {
  res.render("pages/auth", {
    title: "Account",
    bannerTitle: "Account",
  })
})

app.use("/help", (req, res, next) => {
  res.render("pages/help", {
    msg: "Need help? Ask your questions here.",
    title: "Help",
    bannerTitle: "Help",
  })
})

app.use("/search", (req, res, next) => {
  res.render("pages/search", {
    title: "Search",
    bannerTitle: "Search",
  })
})

app.use("/login", (req, res, next) => {
  res.render("pages/auth", {
    title: "Login",
    bannerTitle: "Login",
  })
})

app.use("/register/:id", (req, res, next) => {
  res.render("pages/verify_account", {
    title: "Welcome",
    bannerTitle: "Welcome",
  })
})

app.use("/register", (req, res, next) => {
  res.render("pages/auth", {
    title: "Register",
    bannerTitle: "Register",
  })
})

app.use("/verify", (req, res, next) => {
  res.render("pages/verify_account", {
    title: "Verify",
    bannerTitle: "Verify",
  })
})

app.use("/verified", (req, res, next) => {
  res.render("pages/verify_account", {
    title: "Verified",
    bannerTitle: "Verified",
  })
})

app.use("/", (req, res, next) => {
  res.render("pages/index", { title: "Home" })
})

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
