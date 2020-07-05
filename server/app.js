// ******************************************
// IMPORTS
// ******************************************
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const app = express();

const User = require('./models/User');

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

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
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
				res.status(201).json({
					message: `You have successfully created your account, ${result.email}`
				});
			})
			.catch((error) => {
				res.status(500).json({
					message: 'Invalid email or password!'
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
			if (!result) {
				return res.status(401).json({
					message: 'Authentication has been failed at password comparison.'
				});
			}

			res.status(200).json({
				userID: fetchedUser._id
			});
		})
		.catch((error) => {
			return res.status(500).json({
				message: `The system has found the following error: ${error}`
			});
		});
});

// ******************************************
// EXPORT APP TO THE SERVER FILE
// ******************************************
module.exports = app;
