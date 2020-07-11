const middleware = {};
const jwt = require('jsonwebtoken');

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

module.exports = middleware;
