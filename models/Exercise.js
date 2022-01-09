//! Find a way to incorporate custom images and not URLs
//     images: [
//{
//  type: String,
// },
//],
//

const mongoose = require("mongoose")
const { Schema } = mongoose

const exerciseSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
      required: [true, "Please provide exercise title"],
    },
    subject: {
      type: String,
    },
    chapter: {
      type: String,
      required: [true, "Please pick a chapter for this exercise"],
    },
    section: {
      type: String,
      required: [true, "Please pick a section for this exercise"],
    },
    tags: {
      type: Array,
    },
    problems: {
      type: Object,
      required: [true, "Please provide a set of problems"],
    },
    usedPIDs: {
      type: Array,
      required: [true, "Please provide a list of all problem IDs"],
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    type: {
      type: String,
      default: "exercise",
    },
    hits: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
)

module.exports = mongoose.model("Exercise", exerciseSchema)
