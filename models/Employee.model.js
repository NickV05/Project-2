const { Schema, model } = require('mongoose');

const employeeSchema = new Schema({
   number: { type: String},
   level: { type: String},
   position: { type: String},
  },
  {
    timestamps: true
  });

module.exports = model("Employee", employeeSchema);