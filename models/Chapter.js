const mongoose = require("mongoose")
const { Schema } = mongoose

const chapterSchema = new Schema({
  gr_lvl: {
    type: String,
    required: [true, "Please provide a grade level"],
  },
  title: {
    number: {
      type: Number,
      required: [true, "Please provide a number for this chapter"],
    },
    name: {
      type: String,
      required: [true, "Please provide a name for this chapter"],
    },
  },
  sections: {
    type: Object,
    required: [true, "Please provide sections for this chapter"],
  },
})

module.exports = mongoose.model("Chapter", chapterSchema)
