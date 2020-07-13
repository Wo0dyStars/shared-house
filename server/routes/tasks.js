const express = require('express');
const router = express.Router();

const middleware = require('../middleware/authentication');
const TasksController = require('../controller/tasks');

router.post('/new', middleware.isLoggedIn, middleware.hasHouse, TasksController.createTask);
router.get('/show', middleware.isLoggedIn, middleware.hasHouse, TasksController.getTasks);

module.exports = router;
