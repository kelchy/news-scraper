const db = require('../models');

const getComments = (req, res) => {
  
}

const saveComment = (req, res) => {
  db.Comment.create(req.body)
    .then(comment => {
      return db.Article.findOneAndUpdate({ _id: req.params.article_id }, {$push: {"comments": comment._id}}, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });

}

const deleteComment = (req, res) => {
  db.Comment.deleteOne({_id: req.params.id}).then(deleted => {
    res.json(deleted);
  });
}

module.exports = {
  getComments,
  saveComment,
  deleteComment
}
