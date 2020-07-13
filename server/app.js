// ******************************************
// IMPORTS
// ******************************************
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// ******************************************
// ROUTES IMPORTS
// ******************************************
const homeRoutes = require('./routes/home');
const userRoutes = require('./routes/users');
const shoppingListRoutes = require('./routes/shopping-list');
const purchaseRoutes = require('./routes/purchase');
const tasksRoutes = require('./routes/tasks');
const availableTasksRoutes = require('./routes/available-tasks');
const assignedTasksRoutes = require('./routes/assigned-tasks');
const newsRoutes = require('./routes/news');
const leaderBoardRoutes = require('./routes/leaderboard');

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
	.catch((error) => {
		console.log('Your attempt to connect to MongoDB database has been failed.', error);
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

app.use('/', homeRoutes);
app.use('/users', userRoutes);
app.use('/users/shopping-list', shoppingListRoutes);
app.use('/users/purchase', purchaseRoutes);
app.use('/users/task', tasksRoutes);
app.use('/users/availabletask', availableTasksRoutes);
app.use('/users/assignedtask', assignedTasksRoutes);
app.use('/users/news', newsRoutes);
app.use('/users/leaderboard', leaderBoardRoutes);

app.get('/', (req, res, next) => {
	return res.status(200).json({
		message: 'This is home page'
	});
});

// ******************************************
// EXPORT APP TO THE SERVER FILE
// ******************************************
module.exports = app;
