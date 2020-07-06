// **********************************
// IMPORTS
// **********************************
const mongoose = require('mongoose');

// **********************************
// DECLARATION OF SCHEMA
// **********************************
const tokenSchema = mongoose.Schema({
	userID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
	token: { type: String, required: true },
	createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
});

// **********************************
// EXPORTING SCHEMA
// **********************************
module.exports = mongoose.model('Token', tokenSchema);
