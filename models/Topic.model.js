const { Schema, model } = require('mongoose');
const { link } = require('../routes');
 
const topicSchema = new Schema({
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    topicName: { type: String, maxlength: 77,required: [true, 'Topic name is required.']},
    content: { type: String, required: [true, 'Write your question.']},
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    photo: {type: String, default: null}
  },
  {
    timestamps: true
  });
 
module.exports = model('Topic', topicSchema);