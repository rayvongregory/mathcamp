const mongoose = require("mongoose")
const { Schema } = mongoose

const lessonSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
      required: [true, "Please provide lesson title"],
    },
    subject: {
      type: String,
    },
    chapter: {
      type: String,
      required: [true, "Please pick a chapter for this lesson"],
    },
    section: {
      type: String,
      required: [true, "Please pick a section for this lesson"],
    },
    tags: {
      type: Array,
    },
    html: {
      type: String,
      default: "",
    },
    css: {
      type: String,
      default: "",
    },
    js: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    type: {
      type: String,
      default: "lesson",
    },
    hits: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Lesson", lessonSchema)
