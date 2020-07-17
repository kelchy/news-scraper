const request = require('request');
const cheerio = require('cheerio');
const child = require('child_process');
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
    if (!article.title) {
      // assume https if not present
      if (article.link.slice(0, 4) != 'http') article.link = `https://${article.link}`;
      article.title = await urlTitle(article.link).catch(e=>console.error(e));
    }
    child.exec(`python3 ./predictor/predict.py "${article.title}"`, { timeout: 10000 }, (error, stdout, stderr) => {
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

// kelvin: get title of url
const urlTitle = (url) => {
  return new Promise((resolve, reject) => {
    request(url, function (error, response, body) {
      if (error) return reject(error);
      if (response && response.statusCode != 200) return new Error(`Error: ${url} ${response.statusCode}`);
      const $ = cheerio.load(body);
      const title = $("head > title").text().trim();
      resolve(title);
    });
  });
}

/* kelvin: unused, need to load https://github.com/jontewks/puppeteer-heroku-buildpack for heroku
async function puppe(url) {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] }).catch(e=>console.error(e));
  const page = await browser.newPage().catch(e=>console.error(e));
  await page.goto(article.link, { waitUntil: 'domcontentloaded' }).catch(e=>console.error(e));
  const title = await page.title().catch(e=>console.error(e));
  browser.close().catch(e=>console.error(e));
  return title;
}
*/

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
  // kelvin: urlTitle, tag
  urlTitle,
  tagArticle
}
