require('dotenv').config();
const { colors } = require('./colors');

const { MongoClient } = require('mongodb');

module.exports = {
	connect() {
		// Connect to database
		(async () => {
			try {
				const mongodb = new MongoClient(process.env.MONGODB_URI);
				await mongodb.connect();
				console.log(colors.blue + '[INFO] Successfully connect to the database' + colors.reset);
			}
			catch (error) {
				console.error('Can not connect to the database');
				console.error(error);
			}
		})();
	},
};