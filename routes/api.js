const express = require('express');
const router = express.Router();
const scraperController = require('../controllers/scraperController');
const articleController = require('../controllers/articleController');

router.get('/scrape', (req, res) => {
  scraperController.getAllArticles(req, res);
});

router.post('/articles', (req, res) => {
  articleController.saveArticle(req, res);
});

module.exports = router;