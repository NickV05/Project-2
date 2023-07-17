const { Schema, model } = require('mongoose');
const { link } = require('../routes');
 
const topicSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    content: { type: String, maxlength: 400 }
  });
 
module.exports = model('Topic', topicSchema);