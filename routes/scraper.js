const express = require('express');
const router = express.Router();
const scraperController = require('../controllers/scraperController');

router.get('/cnn-scraper', (req, res) => {
  scraperController.getCnnArticles(req, res)
});

router.get('/msnbc-scraper', (req, res) => {
  scraperController.getMsnbcArticles(req, res);
});

router.get('/foxnews-scraper', (req, res) => {
  scraperController.getFoxNewsArticles(req, res);
});

module.exports = router;