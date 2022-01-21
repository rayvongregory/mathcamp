require("dotenv").config()
require("ejs")
const connectDB = require("./db/connect")
const refreshTokens = require("./db/redis-cache")
const lessonsRouter = require("./routes/lessons")
const learnRouter = require("./routes/resource")
const practiceRouter = require("./routes/resource")
const exercisesRouter = require("./routes/exercise")
const draftsRouter = require("./routes/drafts")
const commentRouter = require("./routes/comment")
const searchRouter = require("./routes/search")
const authRouter = require("./routes/auth")
const usersRouter = require("./routes/users")
const draftRouter = require("./routes/draft")
const chaptersRouter = require("./routes/chapters")
const snippetsRouter = require("./routes/snippets")
const verifyWelcomeToken = require("./middleware/verifyWelcomeToken")
const verifyAccessToken = require("./middleware/verifyAccessToken")
const {
  isAdmin,
  isNotAdmin,
  isLoggedIn,
  isNotLoggedIn,
  handleRedirect,
  handleUnexpectedRole,
} = require("./middleware/verifyRole")
const express = require("express")
const expressFileUpload = require("express-fileupload")
const app = express()
const helmet = require("helmet")
const xss = require("xss-clean")
const cors = require("cors")
const mongoSanitize = require("express-mongo-sanitize")
const cookieParser = require("cookie-parser")

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
)
app.use(cors())
app.use(xss())
app.use(mongoSanitize())
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(express.static(__dirname + "/public"))
app.use(express.urlencoded({ limit: "200mb", extended: false }))
app.use(express.json({ limit: "200mb" }))
app.use(expressFileUpload())
app.set("view engine", "ejs")
app.use("/api/v1/lessons", verifyAccessToken, lessonsRouter)
app.use("/api/v1/exercises", verifyAccessToken, exercisesRouter)
app.use("/api/v1/comment", verifyAccessToken, commentRouter)
app.use("/api/v1/auth", verifyAccessToken, authRouter)
app.use("/api/v1/chapters", verifyAccessToken, chaptersRouter)
app.use(
  "/api/v1/users",
  verifyAccessToken,
  isLoggedIn,
  handleUnexpectedRole,
  usersRouter
)
app.use(
  "/api/v1/drafts",
  verifyAccessToken,
  isAdmin,
  handleUnexpectedRole,
  draftsRouter
)
app.use(
  "/api/v1/snippets",
  verifyAccessToken,
  isAdmin,
  handleUnexpectedRole,
  snippetsRouter
)
app.use("/api/v1/search", searchRouter)
app.use("/drafts", verifyAccessToken, isAdmin, handleRedirect, draftRouter)
app.use("/learn", learnRouter)
app.use("/practice", practiceRouter)
app.use("/axios", express.static(__dirname + "/node_modules/axios"))
app.use("/mathjax", express.static(__dirname + "/node_modules/mathjax"))
app.use("/mathtype", express.static(__dirname + "/node_modules/@wiris"))
app.use("/codemirror", express.static(__dirname + "/node_modules/codemirror"))
app.use("/particlesjs", express.static(__dirname + "/node_modules/particlesjs"))

app.use(
  "/create/lesson",
  verifyAccessToken,
  isAdmin,
  handleRedirect,
  (req, res, next) => {
    res.render("pages/create-pages/create_lesson", {
      type: "lesson",
      title: "Create Lesson",
      bannerTitle: "Create Lesson",
    })
  }
)

app.use(
  "/create/exercise",
  verifyAccessToken,
  isAdmin,
  handleRedirect,
  (req, res) => {
    res.render("pages/create-pages/create_exercise", {
      type: "exercise",
      title: "Create Exercise",
      bannerTitle: "Create Exercise",
    })
  }
)

app.use(
  "/account",
  verifyAccessToken,
  isLoggedIn,
  handleRedirect,
  (req, res, next) => {
    res.render("pages/auth-pages/auth", {
      title: "Account",
      bannerTitle: "Account",
    })
  }
)

app.use(
  "/help/admin",
  verifyAccessToken,
  isAdmin,
  handleRedirect,
  (req, res, next) => {
    res.render("pages/main-site-pages/help-admin", {
      title: "Help",
      bannerTitle: "Help",
    })
  }
)

app.use(
  "/help",
  verifyAccessToken,
  isNotAdmin,
  handleRedirect,
  (req, res, next) => {
    res.render("pages/main-site-pages/help", {
      msg: "Need help? Ask your questions here.",
      title: "Help",
      bannerTitle: "Help",
    })
  }
)

app.use("/search", (req, res, next) => {
  res.render("pages/main-site-pages/search", {
    title: "Search",
    bannerTitle: "Search",
  })
})

app.use(
  "/login",
  verifyAccessToken,
  isNotLoggedIn,
  handleRedirect,
  (req, res, next) => {
    res.render("pages/auth-pages/auth", {
      title: "Login",
      bannerTitle: "Login",
    })
  }
)

app.use(
  "/register",
  verifyAccessToken,
  isNotLoggedIn,
  handleRedirect,
  (req, res, next) => {
    res.render("pages/auth-pages/auth", {
      title: "Register",
      bannerTitle: "Register",
    })
  }
)

app.use("/verify-user", (req, res, next) => {
  res.render("pages/auth-pages/verify_user")
})

app.use("/bad-request", (req, res, next) => {
  res.render("pages/auth-pages/bad-request", {
    bannerTitle: "🤨",
    title: "Bad Request",
  })
})

app.use("/welcome", verifyWelcomeToken, (req, res, next) => {
  res.render("pages/auth-pages/welcome", {
    title: "Welcome",
    bannerTitle: "Welcome",
  })
})

app.use("/", (req, res, next) => {
  res.render("pages/main-site-pages/index", { title: "Home" })
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
