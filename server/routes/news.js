const express = require('express');
const router = express.Router();

const middleware = require('../middleware/authentication');
const NewsController = require('../controller/news');

router.post('/new', middleware.isLoggedIn, middleware.hasHouse, NewsController.createNews);
router.get('/show', middleware.isLoggedIn, middleware.hasHouse, NewsController.getNews);
router.post('/comment/new', middleware.isLoggedIn, middleware.hasHouse, NewsController.createComment);
router.post('/comment/delete', middleware.isLoggedIn, middleware.hasHouse, NewsController.deleteComment);

module.exports = router;
