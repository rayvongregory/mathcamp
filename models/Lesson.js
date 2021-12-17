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
    images: [
      {
        type: String,
      },
    ],
    tags: {
      type: Array,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Lesson", lessonSchema)
