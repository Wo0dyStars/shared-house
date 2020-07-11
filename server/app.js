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
const middleware = require('./middleware/authentication');

const app = express();

const User = require('./models/User');
const Token = require('./models/Token');
const House = require('./models/House');
const ShoppingList = require('./models/ShoppingList');
const Purchase = require('./models/Purchase');
const Task = require('./models/Task');
const AvailableTask = require('./models/AvailableTask');
const AssignedTask = require('./models/AssignedTask');

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

app.post('/users/show', middleware.isLoggedIn, middleware.hasHouse, (req, res, next) => {
	House.findById(req.userHouse)
		.populate('userIDs')
		.then((house) => {
			if (!house) {
				return res.status(400).json({
					message: 'An error occurred while fetching your house data.'
				});
			}

			res.status(200).json({
				message: 'You have successfully fetched all users for your house.',
				housename: house.name,
				users: house.userIDs
			});
		})
		.catch((error) => {
			return res.status(500).json({
				message: error.message
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
				message: `You have successfully updated the "${req.body.element}" field to "${req.body.value}".`,
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

app.get('/users/:id', middleware.isLoggedIn, (req, res, next) => {
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
				postcode: user.postcode,
				houseID: user.houseID
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

	const userMatches = await User.find({})
		.populate('houseID')
		.then((users) => {
			let matched = [];
			users.forEach((user) => {
				if (
					user.postcode.trim().replace(/\s/g, '').toLowerCase() === postcode &&
					user.address.replace(/\D/g, '') === houseNumber
				) {
					matched.push(user);
				}
			});
			return matched;
		})
		.catch((error) => {
			return res.status(500).json({
				message: error.message
			});
		});

	matches = [];
	userMatches.forEach((user) => {
		let match = {
			forename: user.forename,
			surname: user.surname,
			email: user.email,
			houseID: user.houseID
		};

		matches.push(match);
	});

	if (matches.length) {
		return res.status(200).json({
			message: 'You have successfully obtained the list of users.',
			matches: matches
		});
	} else {
		return res.status(400).json({
			message: 'The system was unable to find any house with the provided details.'
		});
	}
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
						User.findByIdAndUpdate(req.params.id, { houseID: house._id })
							.then(() => {
								return res.status(200).json({
									message: `You have successfully created your house with name ${result.name}.`
								});
							})
							.catch((error) => {
								return res.status(500).json({
									message: error.message
								});
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
								// FIND A USER ADDRESS DETAILS

								User.findById(house.userIDs[0]).then((userDetails) => {
									user.address = userDetails.address;
									user.town = userDetails.town;
									user.country = userDetails.country;
									user.postcode = userDetails.postcode;
									user.houseID = userDetails.houseID;

									user
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

app.get('/users/shopping-list/show', middleware.isLoggedIn, middleware.hasHouse, (req, res, next) => {
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
});

app.post('/users/shopping-list/add', middleware.isLoggedIn, middleware.hasHouse, (req, res, next) => {
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
});

app.post('/users/shopping-list/remove', middleware.isLoggedIn, middleware.hasHouse, (req, res, next) => {
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
});

app.post('/users/purchase/new', middleware.isLoggedIn, middleware.hasHouse, (req, res, next) => {
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
});

app.get('/users/purchase/show', middleware.isLoggedIn, middleware.hasHouse, (req, res, next) => {
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
});

app.post('/users/task/new', middleware.isLoggedIn, middleware.hasHouse, (req, res, next) => {
	const task = req.body.taskData;
	task.houseID = req.userHouse;

	const now = new Date().toISOString().slice(0, 10);

	newTask = new Task(task);
	newTask
		.save()
		.then((task) => {
			const availableTask = new AvailableTask({
				task: task._id,
				availableFrom: now
			});

			availableTask
				.save()
				.then(() => {
					return res.status(200).json({
						message: `You have successfully created a new task`
					});
				})
				.catch((error) => {
					return res.status(400).json({
						message: error.message
					});
				});
		})
		.catch((error) => {
			return res.status(500).json({
				message: error.message
			});
		});
});

app.get('/users/task/show', middleware.isLoggedIn, middleware.hasHouse, (req, res, next) => {
	Task.find({ houseID: req.userHouse })
		.then((tasks) => {
			if (!tasks) {
				return res.status(400).json({
					message: 'There are no tasks for selected house.'
				});
			}

			return res.status(200).json({
				message: 'You have successfully fetched the tasks for your house.',
				tasks: tasks
			});
		})
		.catch((error) => {
			return res.status(500).json({
				message: error.message
			});
		});
});

app.get('/users/availabletask/show', middleware.isLoggedIn, middleware.hasHouse, (req, res, next) => {
	AvailableTask.find({})
		.populate({
			path: 'task',
			match: { houseID: req.userHouse }
		})
		.then((tasks) => {
			return res.status(200).json({
				message: 'You have successfully fetched available tasks.',
				tasks: tasks
			});
		})
		.catch((error) => {
			return res.status(500).json({
				message: error.message
			});
		});
});

app.get('/users/availabletask/update', middleware.isLoggedIn, middleware.hasHouse, async (req, res, next) => {
	const currentTasks = await AvailableTask.find({}).populate({
		path: 'task',
		match: { houseID: req.userHouse }
	});

	const now = new Date(new Date().toISOString().slice(0, 10));

	currentTasks.forEach((task) => {
		const nextDate = new Date(new Date().toISOString().slice(0, 10));
		nextDate.setDate(now.getDate() + task.task.frequency);

		const currentDate = new Date(task.availableFrom);

		if (currentDate.getTime() === now.getTime()) {
			AvailableTask.updateOne(
				{ _id: task._id },
				{ availableFrom: nextDate.toISOString().slice(0, 10), available: true }
			).catch((error) => {
				return res.status(500).json({
					message: error.message
				});
			});
		}
	});

	return res.status(200).json({
		message: 'You have successfully updated the required fields.'
	});
});

app.get('/users/assignedtask/new/:id', middleware.isLoggedIn, middleware.hasHouse, async (req, res, next) => {
	const assignedTask = new AssignedTask({
		userID: req.userID,
		date: new Date().toISOString().slice(0, 10),
		availableTaskID: req.params.id
	});

	assignedTask
		.save()
		.then(() => {
			AvailableTask.updateOne({ _id: req.params.id }, { available: false }).catch((error) => {
				return res.status(500).json({
					message: error.message
				});
			});

			return res.status(200).json({
				message: `You have been successfully assigned to the task.`
			});
		})
		.catch((error) => {
			return res.status(400).json({
				message: error.message
			});
		});
});

app.get('/users/assignedtask/show', middleware.isLoggedIn, middleware.hasHouse, async (req, res, next) => {
	AssignedTask.find({ userID: req.userID })
		.populate({
			path: 'availableTaskID',
			populate: {
				path: 'task'
			}
		})
		.populate('userID')
		.then((tasks) => {
			if (!tasks) {
				return res.status(400).json({
					message: 'There are no assigned tasks for selected user.'
				});
			}

			return res.status(200).json({
				tasks: tasks
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
