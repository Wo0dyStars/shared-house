const express = require('express');
const router = express.Router();

const middleware = require('../middleware/authentication');
const AvailableTaskController = require('../controller/available-tasks');

router.get('/show', middleware.isLoggedIn, middleware.hasHouse, AvailableTaskController.getAvailableTasks);
router.get('/update', middleware.isLoggedIn, middleware.hasHouse, AvailableTaskController.updateAvailableTasks);

module.exports = router;
