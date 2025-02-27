// Require for dotenv
require('dotenv').config();

// Require necessary discord.js classes
const { MongoClient } = require('mongodb');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Player } = require('discord-player');
const { DefaultExtractors } = require('@discord-player/extractor');
const token = process.env.TOKEN;
const fs = require('node:fs');
const path = require('node:path');


// Create new client
const client = new Client ({ intents: [
	GatewayIntentBits.Guilds, 
	GatewayIntentBits.GuildVoiceStates,
] 
 });

// Create client command
client.commands = new Collection;

// Create new Player for music bot
const player = new Player(client);

// Create client coolsdown
// Structure of the cooldowns: <key(command name) - value(A: Collection)>
// A's Structure: <key(user ID) - value(timestap when invoke the command)>
client.cooldowns = new Collection;

// Adding commands to the client commands collection
const foldersPath = path.join(__dirname, '/commands');
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
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Command handler
const eventsPath = path.join(__dirname, 'events');
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

// Connect to database
const mongodb = new MongoClient(process.env.MONGODB_URI);

async function databaseConnect() {
	try {
		await mongodb.connect();
		console.log('Successfully connect to the database');
	} catch (error) {
		console.error('Can not connect to the database');
		console.error(error);
	}
}

async function musicPlayerExtract() {
	try {
		await player.extractors.loadMulti(DefaultExtractors);
		console.log('Extractor finished');
	} catch (error) {
		console.error('Fail to use extractor');
		console.error(error);
	}
}

databaseConnect();
musicPlayerExtract();
// Log in to Discord with client's token
client.login(token);