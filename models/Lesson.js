const mongoose = require("mongoose")
const { Schema } = mongoose

const lessonSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
      required: [true, "Please provide lesson title"],
    },

    text: {
      type: String,
      default: "",
    },
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
