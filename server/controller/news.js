const House = require('../models/House');
const News = require('../models/News');

exports.createNews = async (req, res, next) => {
	const news = new News({
		title: req.body.title,
		message: req.body.message,
		userID: req.userID,
		comments: []
	});

	news
		.save()
		.then(() => {
			return res.status(200).json({
				message: `You have successfully added a news item.`
			});
		})
		.catch((error) => {
			return res.status(500).json({
				message: error.message
			});
		});
};

exports.getNews = async (req, res, next) => {
	const userIDs = await House.findById(req.userHouse).then((house) => {
		return house.userIDs;
	});

	News.find({ userID: userIDs })
		.sort({ date: -1 })
		.populate('userID')
		.populate('comments.userID')
		.then((news) => {
			if (!news) {
				return res.status(400).json({
					message: 'There is no news item added yet.'
				});
			}

			return res.status(200).json({
				news: news
			});
		})
		.catch((error) => {
			return res.status(500).json({
				message: error.message
			});
		});
};

exports.createComment = async (req, res, next) => {
	const comment = {
		userID: req.userID,
		message: req.body.message
	};
	News.updateOne({ _id: req.body.newsID }, { $push: { comments: comment } }, { new: true, useFindAndModify: false })
		.then((updatedNews) => {
			if (updatedNews.nModified > 0) {
				return res.status(200).json({
					message: 'You have successfully added a new comment to this news.'
				});
			}
		})
		.catch((error) => {
			return res.status(500).json({
				message: error.message
			});
		});
};

exports.deleteComment = async (req, res, next) => {
	News.updateOne({ 'comments._id': req.body.commentID }, { $pull: { comments: { _id: req.body.commentID } } })
		.then((updatedNews) => {
			if (updatedNews.nModified > 0) {
				return res.status(200).json({
					message: 'You have successfully deleted this comment.'
				});
			}
		})
		.catch((error) => {
			return res.status(500).json({
				message: error.message
			});
		});
};
