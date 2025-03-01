// Require for dotenv
require('dotenv').config();

// Require necessary discord.js classes

const { Client, GatewayIntentBits, Collection } = require('discord.js');

const register = require('./ultility/deploy-command');
const commandLoader = require('./ultility/load-command');
const commandHandlerLoader = require('./ultility/load-command-handlers');
const databaseConnect = require('./ultility/database-connect');

const token = process.env.TOKEN;

// Create new client
const client = new Client ({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildVoiceStates,
],
});

// Create client command
client.commands = new Collection;

// Create client coolsdown
// Structure of the cooldowns: <key(command name) - value(A: Collection)>
// A's Structure: <key(user ID) - value(timestap when invoke the command)>
client.cooldowns = new Collection;

(async () => {
	// Register commands to guild
	await register.deploy();
	// Load the commands to client object
	await commandLoader.load(client);
	// Loand the command handlers to client object
	await commandHandlerLoader.load(client);
	// Connect to the database
	await databaseConnect.connect();
})();

// Log in to Discord with client's token
client.login(token);