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
			useCreateIndex: true
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
			password: hashedPassword
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

// ******************************************
// EXPORT APP TO THE SERVER FILE
// ******************************************
module.exports = app;
