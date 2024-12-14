// models/user.js
const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/facebook");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  posts:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Post'
  }],
  password:{
    type:String
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  phonenumber: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true
  },
  dp:{
    type:String,
  }
});

// Configure passport-local-mongoose to use email as the username
userSchema.plugin(plm,{ usernameField: 'email' });

module.exports = mongoose.model('user', userSchema);


