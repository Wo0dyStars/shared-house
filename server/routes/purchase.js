const express = require('express');
const router = express.Router();

const middleware = require('../middleware/authentication');
const PurchaseController = require('../controller/purchase');

router.post('/new', middleware.isLoggedIn, middleware.hasHouse, PurchaseController.createPurchase);
router.get('/show', middleware.isLoggedIn, middleware.hasHouse, PurchaseController.getPurchases);

module.exports = router;
