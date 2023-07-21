const { Schema, model } = require('mongoose');
 
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
      default: 'https://res.cloudinary.com/dyto7dlgt/image/upload/v1689954676/project-2/fu0iymmcwhd6xofoftos.png',
    },
    employee: {
      type: Boolean,
      default: false
    },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    discussions: [{ type: Schema.Types.ObjectId, ref: "Topic" }]
  },
  {
    timestamps: true
  }
);
 
module.exports = model('User', userSchema);