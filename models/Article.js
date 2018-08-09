const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  source: String,
  category: String,
  title: String,
  link: String,
  dateScraped: { 
    type: Date,
    default: Date.now
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
});

// Custom Instance Methods
ArticleSchema.methods.setCategory = function() {

};

const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;