const Task = require('../models/Task');
const AvailableTask = require('../models/AvailableTask');

exports.createTask = (req, res, next) => {
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
};

exports.getTasks = (req, res, next) => {
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
};
