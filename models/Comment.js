const mongoose = require("mongoose")
const { Schema } = mongoose
const { ObjectId } = mongoose.Types

const commentSchema = new Schema(
  {
    sender: {
      type: ObjectId,
      required: [true, "Please provide a sender for this comment."],
    },
    comment: {
      question: {
        type: String,
        required: [true, "Please provide a title"],
      },
      details: {
        type: String,
      },
      sentAt: {
        type: Date,
        default: Date.now(),
      },
    },
    replies: [
      {
        sender: {
          type: String, // will need to be cast to an ObjectId
          required: [true, "Please provide a sender for this reply."],
        },
        reply: {
          type: String,
          date: Date.now(),
          required: [true, "Please provide a message."],
        },
        sentAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    status: {
      type: String,
      enum: ["new", "read", "replied"],
      default: "new",
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Comment", commentSchema)
