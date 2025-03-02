require('dotenv').config();

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Player } = require('discord-player');
const { DefaultExtractors } = require('@discord-player/extractor');
const { useMainPlayer } = require('discord-player');

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

client.commands = new Collection;
client.cooldowns = new Collection;

// Discord-player set up
const player = new Player(client);

async function loadPlayer() {
	try {
		await player.extractors.loadMulti(DefaultExtractors);
	}
	catch (error) {
		console.error(error);
	}
}
// Set up the bot
(async () => {
	// Register commands to guild
	await register.deploy();
	// Load the commands to client object
	await clientCommandLoader.load(client);
	// Loand the command handlers to client object
	await clientEventLoader.load(client);
	// Connect to the database
	await databaseConnect.connect();

	await loadPlayer();

	// Log in to Discord with client's token
	client.login(token);
})();

