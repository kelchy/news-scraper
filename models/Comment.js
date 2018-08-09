const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: true,
    minLength: 3,
    maxLength: 64
  },
  body: {
    type: String,
    trim: true,
    required: true,
    minLength: 3,
    maxLength: 240
  },
  rating: { 
    type: Number, 
    required: true,
    min: 1, 
    max: 5
  },
  dateCreated: { 
    type: Date,
    default: Date.now
  }
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;