const express = require("express")
const router = express.Router()
//! must add authentication middleware to do any of these
// yes you do, -rayvon 9/14
// YES YOU DOOOO, -rayvon 9/15

const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/users")

router.route("/").get(getAllUsers)
router.route("/:token").get(getUser).patch(updateUser).delete(deleteUser)

module.exports = router
