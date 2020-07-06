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
	isVerified: { type: Boolean, default: false },
	forename: { type: String, default: '' },
	surname: { type: String, default: '' },
	age: { type: Number, default: 0 },
	occupation: { type: String, default: '' },
	phone: { type: String, default: '' },
	avatar: { type: String, default: '' },
	movedIn: { type: Date, default: Date.now },
	lastUpdated: { type: Date, default: Date.now }
});

// **********************************
// EXPORTING SCHEMA
// **********************************
module.exports = mongoose.model('User', userSchema);
