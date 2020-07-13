const House = require('../models/House');
const AvailableTask = require('../models/AvailableTask');
const AssignedTask = require('../models/AssignedTask');

exports.createAssignedTask = async (req, res, next) => {
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
};

exports.getAssignedTasks = async (req, res, next) => {
	const userIDs = await House.findById(req.userHouse).then((house) => {
		return house.userIDs;
	});

	AssignedTask.find({ userID: userIDs })
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
};

exports.completeTask = async (req, res, next) => {
	AssignedTask.updateOne({ userID: req.userID, _id: req.body.assignedTaskID }, { completed: true })
		.then((updatedTask) => {
			if (updatedTask.nModified > 0) {
				AvailableTask.updateOne({ _id: req.body.availableTaskID }, { available: true })
					.then((updatedTask) => {
						if (updatedTask.nModified > 0) {
							return res.status(200).json({
								message: 'You have successfully completed this task.'
							});
						}
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
};
