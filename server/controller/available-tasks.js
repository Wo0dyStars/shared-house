const AvailableTask = require('../models/AvailableTask');

exports.getAvailableTasks = (req, res, next) => {
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
};

exports.updateAvailableTasks = async (req, res, next) => {
	const currentTasks = await AvailableTask.find({}).populate({
		path: 'task',
		match: { houseID: req.userHouse }
	});

	const now = new Date(new Date().toISOString().slice(0, 10));
	if (currentTasks.length) {
		currentTasks.forEach((task) => {
			if (task.task) {
				const nextDate = new Date(new Date().toISOString().slice(0, 10));
				nextDate.setDate(now.getDate() + task.task.frequency);

				const currentDate = new Date(task.availableFrom);

				if (currentDate.getTime() === now.getTime()) {
					AvailableTask.updateOne(
						{ _id: task._id },
						{ availableFrom: nextDate.toISOString().slice(0, 10) }
					).catch((error) => {
						return res.status(500).json({
							message: error.message
						});
					});
				}
			}
		});
	}

	return res.status(200).json({
		message: 'You have successfully updated the required fields.'
	});
};
