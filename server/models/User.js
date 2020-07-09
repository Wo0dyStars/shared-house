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
	birthday: { type: Date, default: Date.now },
	occupation: { type: String, default: '' },
	phone: { type: String, default: '' },
	avatar: { type: String, default: '' },
	address: { type: String, default: '' },
	town: { type: String, default: '' },
	country: { type: String, default: '' },
	postcode: { type: String, default: '' },
	movedIn: { type: Date, default: Date.now },
	lastUpdated: { type: Date, default: Date.now }
});

// **********************************
// EXPORTING SCHEMA
// **********************************
module.exports = mongoose.model('User', userSchema);
