// Require for dotenv
require('dotenv').config();

// Require necessary discord.js classes
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const token = process.env.TOKEN;
const fs = require('node:fs');
const path = require('node:path');

// Create new client
const client = new Client ({ intents: GatewayIntentBits.Guilds });

// Create client command
client.commands = new Collection;

// Adding commands to the client commands collection
const foldersPath = path.join(__dirname, '../commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));;
	for (const file of commandFiles) {
		const filePath = path.join(commandPath, file);
		const command = require(filePath);


		// Set new item in the collection, set the key as the name in "data" and the value is the module exported by the file
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		}
		else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}
// Run when the client is ready
client.on(Events.ClientReady, readyClinet => {
	console.log(`${readyClinet.user.tag}: Online!`);
});

// Command handler
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching: ${interaction.commandName}`);
		return;
	}

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
		else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
	}
});


// Log in to Discord with your client's token
client.login(token);