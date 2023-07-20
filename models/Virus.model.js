const { Schema, model } = require('mongoose');

const virusSchema = new Schema({
   name: { type: String},
   image: { type: String},
   info: { type: String},
  },
  {
    timestamps: true
  });

module.exports = model("Virus", virusSchema);