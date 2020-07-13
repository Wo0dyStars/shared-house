const express = require('express');
const router = express.Router();

const HomeController = require('../controller/home');

router.post('/register', HomeController.createUser);
router.post('/login', HomeController.loginUser);
router.get('/confirmation/:token', HomeController.verifyToken);

module.exports = router;
