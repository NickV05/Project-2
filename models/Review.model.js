const { Schema, model } = require('mongoose');
const { link } = require('../routes');

const reviewSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    comment: { type: String, required: [true, 'Write your comment.']},
    topic: { type: Schema.Types.ObjectId, ref: "Topic" },
  },
  {
    timestamps: true
  });

module.exports = model("Review", reviewSchema);