const express = require('express');
const router = express.Router();
const scraperController = require('../controllers/scraperController');
const articleController = require('../controllers/articleController');
const commentController = require('../controllers/commentController');

router.get('/scrape', (req, res) => {
  scraperController.getAllArticles(req, res);
});

router.get('/articles', (req, res) => {
  articleController.getArticles(req, res);
});

router.post('/articles', (req, res) => {
  articleController.saveArticle(req, res);
});

router.delete('/articles/:id', (req, res) => {
  articleController.deleteArticle(req, res);
});

router.get('/articles/:article_id/comments', (req, res) => {
  commentController.getComments(req, res);
});

router.post('/articles/:article_id/comments', (req, res) => {
  commentController.saveComment(req, res);
});

router.delete('/articles/:article_id/comments/:id', (req, res) => {
  commentController.deleteComment(req, res);
});

module.exports = router;