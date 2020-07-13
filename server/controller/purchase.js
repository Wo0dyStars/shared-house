const House = require('../models/House');
const Purchase = require('../models/Purchase');

exports.createPurchase = (req, res, next) => {
	Purchase.findOne({ userID: req.userID })
		.then((purchase) => {
			if (!purchase) {
				const newPurchase = new Purchase({
					userID: req.userID,
					items: [ req.body.item ]
				});

				newPurchase
					.save()
					.then(() => {
						return res.status(200).json({
							message: `You have successfully purchased your first item.`
						});
					})
					.catch((error) => {
						return res.status(400).json({
							message: error.message
						});
					});
			} else {
				Purchase.updateOne(
					{
						userID: req.userID
					},
					{ $push: { items: req.body.item } },
					{ new: true, useFindAndModify: false }
				)
					.then(() => {
						return res.status(200).json({
							message: `You have successfully updated your purchases with this new item.`
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

exports.getPurchases = (req, res, next) => {
	House.findById(req.userHouse)
		.then((house) => {
			if (!house) {
				return res.status(400).json({
					message: 'There is no house for the selected users.'
				});
			}

			Purchase.find({ userID: house.userIDs })
				.populate('userID')
				.then((purchases) => {
					return res.status(200).json({
						purchases: purchases
					});
				})
				.catch((error) => {
					return res.status(400).json({
						message: error.message
					});
				});
		})
		.catch((error) => {
			return res.status(400).json({
				message: error.message
			});
		});
};
