const mongoose = require('mongoose');
const validator = require('validator');
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      trim: true
    },
    password: {
      type: String,
      trim: true
    },
    user: {
      type: String,
      enum: ['TUTOR', 'STUDENT']
    }

  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model('User', userSchema);
