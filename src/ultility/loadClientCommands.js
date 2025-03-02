const fs = require('node:fs');
const path = require('node:path');
const { colors } = require('./colors');

module.exports = {
	load(client) {
		// Adding commands to the client commands collection
		console.log(colors.blue + '[INFO] Loading Commands!' + colors.reset);
		const foldersPath = path.join(__dirname, '../commands');
		const commandFolders = fs.readdirSync(foldersPath);

		for (const folder of commandFolders) {
			const commandPath = path.join(foldersPath, folder);
			const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));
			for (const file of commandFiles) {
				const filePath = path.join(commandPath, file);
				const command = require(filePath);

				// Set new item in the collection, set the key as the name in "data" and the value is the module exported by the file
				if ('data' in command && 'execute' in command) {
					client.commands.set(command.data.name, command);
				}
				else {
					console.log(colors.yellow + `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.` + colors.reset);
				}
			}
		}

		console.log(colors.blue + '[INFO] Loading Commands Finished!' + colors.reset);
	},
};