const express = require('express');
const router = express.Router();

const middleware = require('../middleware/authentication');
const LeaderBoardController = require('../controller/leaderboard');

router.get('/show/current', middleware.isLoggedIn, middleware.hasHouse, LeaderBoardController.getLeaderBoardForUser);
router.get('/show', middleware.isLoggedIn, middleware.hasHouse, LeaderBoardController.getLeaderBoard);
router.get('/calculate', middleware.isLoggedIn, middleware.hasHouse, LeaderBoardController.calculateLeaderBoard);

module.exports = router;
