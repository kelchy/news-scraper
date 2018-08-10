const express = require('express');
const router = express.Router();
const scraperController = require('../controllers/scraperController');

router.get('/scrape', (req, res) => {
  scraperController.getAllArticles(req, res);
});

module.exports = router;