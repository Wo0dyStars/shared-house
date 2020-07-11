// **********************************
// IMPORTS
// **********************************
const mongoose = require('mongoose');

// **********************************
// DECLARATION OF SCHEMA
// **********************************
const taskSchema = mongoose.Schema({
	houseID: { type: mongoose.Schema.Types.ObjectId, ref: 'House' },
	name: { type: String, required: true },
	level: { type: Number, required: true },
	frequency: { type: Number, required: true }
});

// **********************************
// EXPORTING SCHEMA
// **********************************
module.exports = mongoose.model('Task', taskSchema);
