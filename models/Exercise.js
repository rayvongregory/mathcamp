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

//! When a user enters a search, we look through the activities db.
//! This db will be a collection of all the articles and problem sets.
//! Whenever a new resource is created, it will be saved as both an activity
//! and either an article or problem set.
//! Each activity, will have a list of tags that we will use to compile the results.
