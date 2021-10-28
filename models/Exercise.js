const mongoose = require("mongoose")
const { Schema } = mongoose

const exerciseSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
      required: [true, "Please provide lesson title"],
    },
    tags: {
      type: Array,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    problems: {
      type: Object,
      required: [true, "Please provide a set of problems"],
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Exercise", exerciseSchema)
