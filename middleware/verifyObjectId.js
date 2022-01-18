const { ObjectId } = require("mongoose").Types

const verifyId = async (req, res, next) => {
  const { id } = req.params
  try {
    let objId = new ObjectId(id)
    if (objId == id) {
      req.body.valid = true
    } else {
      req.body.valid = false
    }
  } catch (err) {
    req.body.valid = false
  }
  next()
}

module.exports = verifyId
