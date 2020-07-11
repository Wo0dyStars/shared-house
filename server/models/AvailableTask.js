// **********************************
// IMPORTS
// **********************************
const mongoose = require('mongoose');

// **********************************
// DECLARATION OF SCHEMA
// **********************************
const availableTaskSchema = mongoose.Schema({
	task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
	available: { type: Boolean, default: true },
	availableFrom: { type: String }
});

// **********************************
// EXPORTING SCHEMA
// **********************************
module.exports = mongoose.model('AvailableTask', availableTaskSchema);
