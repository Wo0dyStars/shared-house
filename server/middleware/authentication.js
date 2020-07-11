const middleware = {};
const jwt = require('jsonwebtoken');
const User = require('../models/User');

middleware.isLoggedIn = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, 'secret');
		req.userID = decodedToken.userId;
		next();
	} catch (error) {
		res.status(500).json({
			message: 'You are not authenticated!'
		});
	}
};

middleware.hasHouse = (req, res, next) => {
	try {
		User.findById(req.userID).then((user) => {
			if (!user.houseID) {
				return res.status(400).json({
					message: 'You do not have any house where you could play.'
				});
			}

			req.userHouse = user.houseID;
			next();
		});
	} catch (error) {
		res.status(500).json({
			message: 'You do not have any house where you could play.'
		});
	}
};

module.exports = middleware;
