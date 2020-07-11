// **********************************
// IMPORTS
// **********************************
const mongoose = require('mongoose');

// **********************************
// DECLARATION OF SCHEMA
// **********************************
const purchaseSchema = mongoose.Schema({
	userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	items: [
		{
			name: { type: String, required: true },
			amount: { type: String, required: true },
			date: { type: Date, default: Date.now }
		}
	]
});

// **********************************
// EXPORTING SCHEMA
// **********************************
module.exports = mongoose.model('Purchase', purchaseSchema);
