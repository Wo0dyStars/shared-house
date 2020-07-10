// ******************************************
// IMPORTS
// ******************************************
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const emailSending = require('./middleware/email-verification');

const app = express();

const User = require('./models/User');
const Token = require('./models/Token');
const House = require('./models/House');

// ******************************************
// CONNECTING TO MONGO DB DATABASE
// ******************************************
mongoose
	.connect(
		'mongodb+srv://Wo0dyStars:' +
			process.env.MONGODB_PASSWORD +
			'@cluster0.blrzn.mongodb.net/<dbname>?retryWrites=true&w=majority',
		{
			useUnifiedTopology: true,
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false
		}
	)
	.then(() => {
		console.log('You are now connected to the Mongo DB database.');
	})
	.catch(() => {
		console.log('Your attempt to connect to MongoDB database has been failed.');
	});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');

	next();
});

app.get('/', (req, res, next) => {
	res.send('here');
});

app.post('/register', (req, res, next) => {
	bcrypt.hash(req.body.password, 10).then((hashedPassword) => {
		const user = new User({
			email: req.body.email,
			password: hashedPassword,
			avatar: 'http://localhost:3000/images/avatar1.webp'
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
						emailSending.sendEmail(result.email, token.token);
					}
				});

				return res.status(201).json({
					message: `You have successfully created your account, ${result.email}`
				});
			})
			.catch((error) => {
				res.status(500).json({
					message: `An error occurred ${error}`
				});
			});
	});
});

app.post('/login', (req, res, next) => {
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
});

app.get('/users', (req, res, next) => {
	User.find({}, 'email -_id').lean().then((emails) => {
		const userEmails = [];
		for (email of emails) {
			userEmails.push(email.email);
		}

		return res.status(200).json({
			emails: userEmails
		});
	});
});

app.post('/users/edit/:id', (req, res, next) => {
	const updateData = {};
	updateData[req.body.element] = req.body.value;
	updateData['lastUpdated'] = new Date();
	User.findByIdAndUpdate(req.params.id, updateData)
		.then((user) => {
			if (!user) {
				return res.status(401).json({
					message: 'The provided user ID does not exist in the database.'
				});
			}

			return res.status(200).json({
				message: 'You have successfully updated the value.',
				modifiedDate: updateData.lastUpdated
			});
		})
		.catch((error) => {
			return res.status(500).json({
				message: error.message
			});
		});
});

app.get('/confirmation/:token', (req, res, next) => {
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
});

app.get('/users/:id', (req, res, next) => {
	User.findById(req.params.id)
		.then((user) => {
			if (!user) {
				return res.status(400).json({
					message: 'The system was unable to find the user with this user ID.'
				});
			}
			return res.status(200).json({
				forename: user.forename,
				surname: user.surname,
				age: user.age,
				occupation: user.occupation,
				phone: user.phone,
				avatar: user.avatar,
				_id: user._id,
				email: user.email,
				password: user.password,
				movedIn: user.movedIn,
				lastUpdated: user.lastUpdated,
				isVerified: user.isVerified,
				birthday: user.birthday,
				address: user.address,
				town: user.town,
				country: user.country,
				postcode: user.postcode
			});
		})
		.catch((error) => {
			return res.status(500).json({
				message: error.message
			});
		});
});

app.post('/users/address', async (req, res, next) => {
	const postcode = req.body.postcodeValue.trim().replace(/\s/g, '').toLowerCase();
	const houseNumber = req.body.addressValue.replace(/\D/g, '');

	await User.find({})
		.then(async (users) => {
			if (!users) {
				return res.status(400).json({
					message: 'The system was unable to find any user with your address.'
				});
			}

			let matchedUsers = [];
			users.forEach(async (user) => {
				if (
					user.postcode.trim().replace(/\s/g, '').toLowerCase() === postcode &&
					user.address.replace(/\D/g, '') === houseNumber
				) {
					await House.find({ userIDs: user._id }).then((house) => {
						let match = {
							forename: user.forename,
							surname: user.surname,
							email: user.email
						};
						if (house.length) {
							match.house = house[0].name;
							match.houseID = house[0]._id;
						}
						matchedUsers.push(match);
					});

					if (matchedUsers.length) {
						return res.status(200).json({
							message: 'You have successfully matched another user.',
							users: matchedUsers
						});
					} else {
						return res.status(400).json({
							message: 'The system was unable to find any user with your address.'
						});
					}
				}
			});
		})
		.catch((error) => {
			return res.status(500).json({
				message: error.message
			});
		});
});

app.post('/users/house/create/:id', (req, res, next) => {
	House.find({ userIDs: req.params.id })
		.then((houseExist) => {
			if (houseExist.length) {
				return res.status(400).json({
					message: 'You are already a member of one house.'
				});
			} else {
				const house = new House({
					name: req.body.housename,
					userIDs: [ req.params.id ]
				});

				house
					.save()
					.then((result) => {
						return res.status(200).json({
							message: `You have successfully created your house with name ${result.name}.`
						});
					})
					.catch((error) => {
						return res.status(500).json({
							message: error.message
						});
					});
			}
		})
		.catch((error) => {
			return res.status(500).json({
				message: error.message
			});
		});
});

app.get('/users/house/join/:userID/:houseID', (req, res, next) => {
	User.findById(req.params.userID)
		.then((user) => {
			if (!user) {
				return res.status(400).json({
					message: 'The system was unable to find any user with the provided user ID.'
				});
			}

			House.findById(req.params.houseID)
				.then((house) => {
					if (!house) {
						return res.status(400).json({
							message: 'There is no house with the provided house ID in the database.'
						});
					}

					if (house.userIDs.includes(req.params.userID)) {
						return res.status(400).json({
							message: 'You have already joined this house.'
						});
					} else {
						house.userIDs.push(req.params.userID);
						house
							.save()
							.then(() => {
								return res.status(200).json({
									message: `You have successfully joined ${house.name}`
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
		})
		.catch((error) => {
			return res.status(400).json({
				message: error.message
			});
		});
});

// ******************************************
// EXPORT APP TO THE SERVER FILE
// ******************************************
module.exports = app;
