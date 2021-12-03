const mongoose = require("mongoose")
const { Schema } = mongoose

const rndSubjSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "Please provide name of random subject"],
  },
  class: {
    type: String,
    required: [true, "Please provide a class name from Font Awesome."],
  },
})

module.exports = mongoose.model("RndSubj", rndSubjSchema)
