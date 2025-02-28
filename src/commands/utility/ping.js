const { SlashCommandBuilder } = require('discord.js');

module.exports = {

	// Data will provide the information related to the commad
	data: new SlashCommandBuilder().setName('ping').setDescription('Replies with "Pong !"'),

	// Logic of the commands
	async execute(interaction) {
		await interaction.reply('Pong !');
	},
};