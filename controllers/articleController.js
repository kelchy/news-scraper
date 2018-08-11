const db = require('../models');

const getArticles = (req, res) => {
  db.Article.find({}).then(articles => {
    res.json(articles);
  }).catch(err => {
    res.json(err);
  });
}

const saveArticle = (req, res) => {
  const article = req.body;

  db.Article.create(article).then(article => {
    res.json(article);
  }).catch(err => {
    res.json(err);
  });
}

const deleteArticle = (req, res) => {
  db.Article.findOne({_id: req.params.id}).then(article => {
    article.remove().then(deleted => {
      res.json(deleted);
    });
  }).catch(err => {
    res.json(err);
  });
}

module.exports = {
  getArticles,
  saveArticle,
  deleteArticle
}
