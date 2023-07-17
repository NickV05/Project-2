const { Schema, model } = require('mongoose');
const { link } = require('../routes');
 
const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, 'Username is required.'],
      unique: true
    },
    fullName: {
      type: String,
      required: [true, 'Your full name is required.']
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required.']
    },
    avatar: {
      type: String,
      default: null,
    },
    employee: {
      type: String,
      default: 'No'
    }
  },
  {
    timestamps: true
  }
);
 
module.exports = model('User', userSchema);