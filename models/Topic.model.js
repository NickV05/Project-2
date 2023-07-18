const { Schema, model } = require('mongoose');
const { link } = require('../routes');
 
const topicSchema = new Schema({
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    topicName: { type: String, maxlength: 77 },
    content: { type: String},
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    photo: {type: String, default: null}
  });
 
module.exports = model('Topic', topicSchema);