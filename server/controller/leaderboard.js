const User = require('../models/User');
const House = require('../models/House');
const Purchase = require('../models/Purchase');
const AssignedTask = require('../models/AssignedTask');
const News = require('../models/News');
const LeaderBoard = require('../models/Leaderboard');

exports.getLeaderBoardForUser = async (req, res, next) => {
	LeaderBoard.findOne({ userID: req.userID }).populate('userID').then((scores) => {
		if (!scores) {
			User.findById(req.userID).then((user) => {
				return res.status(200).json({
					name: user.forename + ' ' + user.surname,
					avatar: user.avatar,
					score: 0
				});
			});
		}

		let total = 0;
		scores.scores.forEach((score) => {
			total += score.score;
		});

		return res.status(200).json({
			name: scores.userID.forename + ' ' + scores.userID.surname,
			avatar: scores.userID.avatar,
			score: total
		});
	});
};

exports.getLeaderBoard = async (req, res, next) => {
	const userIDs = await House.findById(req.userHouse).then((house) => {
		return house.userIDs;
	});

	LeaderBoard.find({ userID: userIDs })
		.populate('userID')
		.then((leaderBoard) => {
			if (!leaderBoard) {
				return res.status(400).json({
					message: 'There are no leaderboard scores calculated yet for your house.'
				});
			}

			return res.status(200).json({
				leaderBoard: leaderBoard
			});
		})
		.catch((error) => {
			return res.status(500).json({
				message: error.message
			});
		});
};

exports.calculateLeaderBoard = async (req, res, next) => {
	const userIDs = await House.findById(req.userHouse).then((house) => {
		return house.userIDs;
	});

	let update = false;
	userIDs.forEach(async (userID) => {
		const taskScore = await AssignedTask.find({ userID: userID }).then((tasks) => {
			if (!tasks) return 0;

			let taskScore = 0;
			tasks.forEach((task) => {
				if (task.completed) {
					taskScore += 2;
				}
			});

			return taskScore;
		});

		const newsScore = await News.find({ userID: userID }).then((news) => {
			return news.length * 2;
		});

		const commentScore = await News.find({ 'comments.userID': userID }, 'comments').then((news) => {
			if (!news) return 0;

			let commentScore = 0;
			news.forEach((comments) => {
				comments.comments.forEach((comment) => {
					if (comment.userID.equals(userID)) {
						commentScore++;
					}
				});
			});

			return commentScore;
		});

		const purchaseScore = await Purchase.find({ userID: userID }).then((purchases) => {
			if (!purchases) return 0;

			if (purchases[0]) {
				return purchases[0].items.length;
			} else return 0;
		});

		const leaderBoard = new LeaderBoard({
			userID: userID,
			scores: [
				{
					activity: 'tasks',
					score: taskScore
				},
				{
					activity: 'news',
					score: newsScore
				},
				{
					activity: 'purchases',
					score: purchaseScore
				},
				{
					activity: 'comments',
					score: commentScore
				}
			]
		});

		LeaderBoard.findOne({ userID: userID })
			.then((user) => {
				if (!user) {
					leaderBoard.save();
				} else {
					LeaderBoard.updateOne(
						{ userID: userID },
						{
							'scores.0.score': taskScore,
							'scores.1.score': newsScore,
							'scores.2.score': purchaseScore,
							'scores.3.score': commentScore
						}
					).then((updateBoard) => {
						if (updateBoard.nModified > 0) update = true;
					});
				}
			})
			.catch((error) => {
				return res.status(500).json({
					message: error.message
				});
			});
	});

	if (update) {
		return res.status(200).json({
			message: 'You have successfully updated your leaderboard scores.'
		});
	} else {
		return res.status(200).json({
			message: 'You have either created or not modified your leaderboard scores.'
		});
	}
};
