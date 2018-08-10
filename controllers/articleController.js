const db = require('../models');

const saveArticle = (req, res) => {
  const article = req.body;

  db.Article.create(article).then(article => {
    res.json(article);
  }).catch(err => {
    res.json(err);
  });
}

module.exports = {
  saveArticle
}
