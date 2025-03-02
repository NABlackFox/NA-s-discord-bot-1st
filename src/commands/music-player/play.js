const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const { PermissionsBitField } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder().setName('play').setDescription('Play the song selected').addStringOption((option) => option.setName('song').setDescription('Enter the song').setRequired(true)),

	async execute(interaction) {
		// get the player using hook
		const player = useMainPlayer();
		// get the song
		const query = interaction.options.getString('song', true);
		// get the channel user in
		const voiceChannel = interaction.member.voice.channel;

		// Check if user is in voice channel
		if (!voiceChannel) {
			return interaction.reply({ content: 'You must be in the voice channel to use this command', flags: MessageFlags.Ephemeral });
		}

		// check if the bot is already in another channel
		if (interaction.guild.members.me.voice.channel &&
           (interaction.guild.members.me.voice.channel != interaction.member.voice.channel)) {
			return interaction.reply({ content: 'Already playing in different channel', flags: MessageFlags.Ephemeral });
		}

		try {
            await interaction.deferReply();
            // Play the song in the voice channel
            const result = await player.play(voiceChannel, query, {
                nodeOptions: {
                metadata: { channel: interaction.channel }, // Store text channel as metadata on the queue
                },
            });

            // Reply to the user that the song has been added to the queue
            await interaction.reply(
                ` has been added to the queue!`
            );
		}
		catch (error) {
			console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.reply({ content: 'Cannot add song to queue', flags: MessageFlags.Ephemeral });
            } else {
                await interaction.followUp({ content: 'Cannot add song to queue', flags: MessageFlags.Ephemeral });
            }
		}
	},
};