const User = require('../models/User');
const Token = require('../models/Token');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const emailSending = require('../middleware/email-verification');

exports.createUser = (req, res, next) => {
	bcrypt.hash(req.body.password, 10).then((hashedPassword) => {
		const user = new User({
			email: req.body.email,
			password: hashedPassword,
			avatar: req.body.URL + '/images/avatar1.webp'
		});

		user
			.save()
			.then((result) => {
				let token = new Token({
					userID: result._id,
					token: crypto.randomBytes(16).toString('hex')
				});

				token.save((error) => {
					if (error) {
						return res.status(500).json({ message: error.message });
					} else {
						emailSending.sendEmail(result.email, token.token, req.body.ANGULAR);
					}
				});

				return res.status(201).json({
					message: `You have successfully created your account, ${result.email}`,
					userID: result._id
				});
			})
			.catch((error) => {
				res.status(500).json({
					message: `An error occurred ${error}`
				});
			});
	});
};

exports.loginUser = (req, res, next) => {
	let fetchedUser = '';
	User.findOne({ email: req.body.email })
		.then((user) => {
			if (!user) {
				return res.status(401).json({
					message: 'The provided email does not exist in the database.'
				});
			}

			fetchedUser = user;
			return bcrypt.compare(req.body.password, user.password);
		})
		.then((result) => {
			if (fetchedUser.isVerified === false) {
				return res.status(401).json({
					message: 'Your account has not been verified yet.'
				});
			}

			if (!result) {
				return res.status(401).json({
					message: 'Authentication has been failed at password comparison.'
				});
			} else {
				const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id }, 'secret', {
					expiresIn: '1h'
				});

				return res.status(200).json({
					token: token,
					expiresIn: 3600,
					userID: fetchedUser._id
				});
			}
		})
		.catch((error) => {
			return res.status(500).json({
				message: `The system has found the following error: ${error}`
			});
		});
};

exports.verifyToken = (req, res, next) => {
	Token.findOne({ token: req.params.token }).then((foundToken) => {
		if (!foundToken) {
			return res.status(400).json({
				message: 'The system was unable to find a valid token. Your token might have expired.'
			});
		}

		User.findOne({ _id: foundToken.userID }).then((user) => {
			if (!user) {
				return res.status(400).json({
					message: 'The system was unable to find the user for this token.'
				});
			}

			if (user.isVerified) {
				return res.status(400).json({
					message: 'This user has already been verified.'
				});
			}

			user.isVerified = true;

			// REMOVE TOKEN AS IT IS UNNECESSARY
			Token.deleteOne({ token: req.params.token }).then((deletedToken) => {
				if (deletedToken) {
					console.log('Token has been deleted for verified user');
				}
			});

			user
				.save()
				.then((result) => {
					return res.status(200).json({
						message: 'The account has been verified. Please log in.'
					});
				})
				.catch((error) => {
					return res.status(500).json({
						message: error.message
					});
				});
		});
	});
};
