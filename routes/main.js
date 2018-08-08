const express = require('express');
const router = express.Router();
const cnnScraper = require('../controllers/cnnScraper');

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/cnnscraper', (req, res) => {
  cnnScraper.getCnnPage(req, res)
});

module.exports = router;