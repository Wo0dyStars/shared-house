const express = require('express');
const router = express.Router();

const middleware = require('../middleware/authentication');
const ShoppingListController = require('../controller/shopping-list');

router.get('/show', middleware.isLoggedIn, middleware.hasHouse, ShoppingListController.getShoppingList);
router.post('/add', middleware.isLoggedIn, middleware.hasHouse, ShoppingListController.addItem);
router.post('/remove', middleware.isLoggedIn, middleware.hasHouse, ShoppingListController.removeItem);

module.exports = router;
