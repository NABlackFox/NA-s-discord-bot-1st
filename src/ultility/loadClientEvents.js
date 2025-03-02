const fs = require('node:fs');
const path = require('node:path');
const { colors } = require('./colors');

module.exports = {
	load(client) {
		console.log(colors.blue + '[INFO] Loading Command Handlers!' + colors.reset);

		const eventsPath = path.join(__dirname, '../events/client-events');
		const eventsFolder = fs.readdirSync(eventsPath);

		for (const eventFile of eventsFolder) {
			const filePath = path.join(eventsPath, eventFile);
			const event = require(filePath);

			if (event.once) {
				// using callback function
				client.once(event.name, (...args) => event.execute(...args));
			}
			else {
				client.on(event.name, (...args) => event.execute(...args));
			}
		}
		console.log(colors.blue + '[INFO] Loading Command Handlers Finished!' + colors.reset);
	},
};