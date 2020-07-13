const express = require('express');
const router = express.Router();

const middleware = require('../middleware/authentication');
const AssignedTaskController = require('../controller/assigned-tasks');

router.get('/new/:id', middleware.isLoggedIn, middleware.hasHouse, AssignedTaskController.createAssignedTask);
router.get('/show', middleware.isLoggedIn, middleware.hasHouse, AssignedTaskController.getAssignedTasks);
router.post('/complete', middleware.isLoggedIn, middleware.hasHouse, AssignedTaskController.completeTask);

module.exports = router;
