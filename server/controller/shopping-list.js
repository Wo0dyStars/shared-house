const ShoppingList = require('../models/ShoppingList');

exports.getShoppingList = (req, res, next) => {
	ShoppingList.findOne({ houseID: req.userHouse })
		.then((shoppingList) => {
			if (!shoppingList) {
				return res.status(400).json({
					message: 'The system was unable to find your shopping list.'
				});
			}

			res.status(200).json({
				shoppingList: shoppingList
			});
		})
		.catch((error) => {
			return res.status(500).json({
				message: error.message
			});
		});
};

exports.addItem = (req, res, next) => {
	const item = {
		name: req.body.item,
		amount: req.body.amount
	};
	ShoppingList.find({ houseID: req.userHouse })
		.then((shoppingList) => {
			if (!shoppingList.length) {
				// There is no shopping list for selected house
				const newShoppingList = new ShoppingList({
					houseID: req.userHouse,
					items: [ item ]
				});

				newShoppingList
					.save()
					.then(() => {
						return res.status(200).json({
							message: `You have successfully created your shopping list.`
						});
					})
					.catch((error) => {
						return res.status(400).json({
							message: error.message
						});
					});
			} else {
				// There is shopping list already for selected house

				ShoppingList.updateOne(
					{
						houseID: req.userHouse
					},
					{ $push: { items: item } },
					{ new: true, useFindAndModify: false }
				)
					.then(() => {
						return res.status(200).json({
							message: `You have successfully updated your shopping list.`
						});
					})
					.catch((error) => {
						return res.status(400).json({
							message: error.message
						});
					});
			}
		})
		.catch((error) => {
			return res.status(400).json({
				message: error.message
			});
		});
};

exports.removeItem = (req, res, next) => {
	ShoppingList.updateOne({ houseID: req.userHouse }, { $pull: { items: req.body.item } })
		.then(() => {
			return res.status(200).json({
				message: `You have successfully removed item from your shopping list.`
			});
		})
		.catch((error) => {
			return res.status(400).json({
				message: error.message
			});
		});
};
