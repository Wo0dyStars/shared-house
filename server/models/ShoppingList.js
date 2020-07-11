// **********************************
// IMPORTS
// **********************************
const mongoose = require('mongoose');

// **********************************
// DECLARATION OF SCHEMA
// **********************************
const shoppinglistSchema = mongoose.Schema({
	houseID: { type: mongoose.Schema.Types.ObjectId, ref: 'House' },
	items: [
		{
			name: { type: String, required: true },
			amount: { type: String, required: true }
		}
	]
});

// **********************************
// EXPORTING SCHEMA
// **********************************
module.exports = mongoose.model('ShoppingList', shoppinglistSchema);
