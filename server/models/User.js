// **********************************
// IMPORTS
// **********************************
const mongoose = require('mongoose');

// **********************************
// DECLARATION OF SCHEMA
// **********************************
const userSchema = mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	forename: { type: String },
	surname: { type: String },
	age: { type: Number },
	occupation: { type: String },
	phone: { type: String },
	avatar: { type: String },
	movedIn: { type: Date, default: Date.now },
	lastUpdated: { type: Date }
});

// **********************************
// EXPORTING SCHEMA
// **********************************
module.exports = mongoose.model('User', userSchema);
