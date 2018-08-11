const db = require('../models');

const saveComment = (req, res) => {
  db.Comment.create(req.body)
    .then(comment => {
      db.Article.findOneAndUpdate({ _id: req.params.article_id }, {$push: {"comments": comment._id}}, { new: true }).then(article => {
        res.json([
          comment,
          article
        ]);
      }).catch(err => {
        res.json(err);
      });
    })
    .catch(err => {
      res.json(err);
    });
}

const deleteComment = (req, res) => {
  // bugged -> deleting comment but not reference
  db.Comment.deleteOne({_id: req.params.id}).then(deleted => {
    res.json(deleted);
  }).catch(err => {
    res.json(err);
  });;
}

module.exports = {
  saveComment,
  deleteComment
}
