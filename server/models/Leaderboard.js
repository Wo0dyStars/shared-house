// **********************************
// IMPORTS
// **********************************
const mongoose = require('mongoose');

// **********************************
// DECLARATION OF SCHEMA
// **********************************
const leaderBoardSchema = mongoose.Schema({
	userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	scores: [
		{
			activity: { type: String, required: true },
			score: { type: Number, required: true }
		}
	]
});

// **********************************
// EXPORTING SCHEMA
// **********************************
module.exports = mongoose.model('LeaderBoard', leaderBoardSchema);
