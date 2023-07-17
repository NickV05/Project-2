const { Schema, model } = require('mongoose');
const { link } = require('../routes');
 
const topicSchema = new Schema({
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    topicName: { type: String, maxlength: 100 },
    content: { type: String, maxlength: 400 }
  });
 
module.exports = model('Topic', topicSchema);