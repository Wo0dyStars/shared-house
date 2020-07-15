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

// REACH OUR ANGULAR APP FOR SERVER
app.use('/', express.static(path.join(__dirname, 'angular')));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');

	next();
});

app.use('/api/', homeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/users/shopping-list', shoppingListRoutes);
app.use('/api/users/purchase', purchaseRoutes);
app.use('/api/users/task', tasksRoutes);
app.use('/api/users/availabletask', availableTasksRoutes);
app.use('/api/users/assignedtask', assignedTasksRoutes);
app.use('/api/users/news', newsRoutes);
app.use('/api/users/leaderboard', leaderBoardRoutes);

// IF NONE OF THOSE ABOVE, RETURN ANGULAR APP
app.use((req, res, next) => {
	res.sendFile(path.join(__dirname, 'angular', 'index.html'));
});

// ******************************************
// EXPORT APP TO THE SERVER FILE
// ******************************************
module.exports = app;
