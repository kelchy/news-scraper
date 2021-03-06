// kelvin: add model for tweets
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TweetSchema = new Schema({
  handle: {
    type: String,
    trim: true,
    required: true,
    minLength: 3,
    maxLength: 240
  },
  articles: [{
    type: String,
    trim: true,
    required: true,
    minLength: 3,
    maxLength: 240
  }],
  tag: {
    type: String,
    trim: true,
    minLength: 3,
    maxLength: 240
  },
  score: {
    type: Number,
  },
});

const Tweet = mongoose.model('Tweet', TweetSchema);

module.exports = Tweet;
