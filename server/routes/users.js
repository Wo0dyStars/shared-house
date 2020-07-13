const express = require('express');
const router = express.Router();

const middleware = require('../middleware/authentication');

const UserController = require('../controller/users');

router.get('', UserController.getUserEmails);
router.post('/show', middleware.isLoggedIn, middleware.hasHouse, UserController.getUsers);
router.post('/edit/:id', UserController.editProfile);
router.get('/:id', middleware.isLoggedIn, UserController.getUserByID);
router.post('/address', UserController.findAddress);
router.post('/house/create/:id', UserController.createHouse);
router.get('/house/join/:userID/:houseID', UserController.joinHouse);

module.exports = router;
