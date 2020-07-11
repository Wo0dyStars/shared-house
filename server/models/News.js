// **********************************
// IMPORTS
// **********************************
const mongoose = require('mongoose');

// **********************************
// DECLARATION OF SCHEMA
// **********************************
const newsSchema = mongoose.Schema({
	title: { type: String, required: true },
	message: { type: String, required: true },
	userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	date: { type: Date, default: Date.now },
	comments: [
		{
			userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
			date: { type: Date, default: Date.now },
			message: { type: String, required: true }
		}
	]
});

// **********************************
// EXPORTING SCHEMA
// **********************************
module.exports = mongoose.model('News', newsSchema);
