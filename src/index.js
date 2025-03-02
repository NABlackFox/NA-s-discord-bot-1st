// Require for dotenv
require('dotenv').config();

// Require necessary discord.js classes

const { Client, GatewayIntentBits, Collection } = require('discord.js');

const register = require('./ultility/deployCommands');
const clientCommandLoader = require('./ultility/loadClientCommands');
const clientEventLoader = require('./ultility/loadClientEvents');
const databaseConnect = require('./ultility/databaseConnect');

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
	await clientCommandLoader.load(client);
	// Loand the command handlers to client object
	await clientEventLoader.load(client);
	// Connect to the database
	await databaseConnect.connect();
})();

// Log in to Discord with client's token
client.login(token);