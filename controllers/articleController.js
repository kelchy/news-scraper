const child = require('child_process');
const puppeteer = require('puppeteer');
const db = require('../models');

const getArticles = (req, res) => {
  let filter = {};
  if (req.query.idx && req.query.asc) {
    filter._id = req.query.asc == '1' ? {'$gt': req.query.idx} : {'$lt': req.query.idx};
  }
  const q = req.query.count ? db.Article.count(filter) :
    db.Article.find(filter).sort({_id: -1}).limit(parseInt(req.query.limit) || 100)
  q.then(articles => {
    res.json(articles);
  }).catch(err => {
    res.json(err);
  });
}

const getArticle = (req, res) => {
  db.Article.findOne({_id: req.params.id})
    .populate('comments')
    .then(article => {
      res.json(article);
    })
    .catch(err => {
      res.json(err);
    });
}

const saveArticle = (req, res) => {
  const article = req.body;
  // kelvin: classify article
  const classify = async (cb) => {
    // we don't want to classify all because it will crash
    if (article.source != 'User') return cb();
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    article.title = await page.title();
    child.exec(`python3 ./predictor/predict.py "${article.title}"`, { timeout: 5000 }, (error, stdout, stderr) => {
      if (error) console.error(error);
      if (stderr) console.error(stderr);
      if (stdout) article.tag = stdout.trim().toLowerCase(); 
      cb();
    });
  };
  classify(() => {
    db.Article.create(article).then(article => {
      res.json(article);
    }).catch(err => {
      res.json(err);
    });
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

// kelvin: update tag
const tagArticle = (req, res) => {
  db.Article.update({_id: req.params.id},{$set:{tag:req.query.tag}}).then(article => {
    res.json(article);
  }).catch(err => {
    res.json(err);
  });
}

module.exports = {
  getArticles,
  getArticle,
  saveArticle,
  deleteArticle,
  tagArticle
}
