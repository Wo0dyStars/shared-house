// **********************************
// IMPORTS
// **********************************
const mongoose = require('mongoose');

// **********************************
// DECLARATION OF SCHEMA
// **********************************
const assignedTaskSchema = mongoose.Schema({
	availableTaskID: { type: mongoose.Schema.Types.ObjectId, ref: 'AvailableTask' },
	userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	date: { type: String },
	accepted: { type: Boolean, default: false },
	completed: { type: Boolean, default: false }
});

// **********************************
// EXPORTING SCHEMA
// **********************************
module.exports = mongoose.model('AssignedTask', assignedTaskSchema);
