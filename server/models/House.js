// **********************************
// IMPORTS
// **********************************
const mongoose = require('mongoose');

// **********************************
// DECLARATION OF SCHEMA
// **********************************
const houseSchema = mongoose.Schema({
	name: { type: String, default: '' },
	userIDs: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}
	]
});

// **********************************
// EXPORTING SCHEMA
// **********************************
module.exports = mongoose.model('House', houseSchema);
