const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const { AttachmentExtractor } = require('@discord-player/extractor');
const { DefaultExtractors } = require('@discord-player/extractor');



module.exports = {
	data: new SlashCommandBuilder().setName('play').setDescription('Play a song in voice channel').addStringOption(option => option.setName('song').setDescription('Play the song selected').setRequired(true)),

	async execute(interaction) {
        const player = interaction.client.player;
        player.extractors.register(AttachmentExtractor);
		const query = interaction.options.getString('song', true);

		const voiceChannel = interaction.member.voice.channel;

		if (!voiceChannel) {
			return interaction.reply({ content: 'You need to be in voice channel to play music!', flags: MessageFlags.Ephemeral });
		}
		
        try {
            await player.extractors.loadMulti(DefaultExtractors);

            const result = await player.play(voiceChannel, query, {
                nodeOptions : {
                    metadata: {
                        channel: interaction.channel
                    },
                }
            });

            return interaction.reply(`${result.track.title} has been added to the queue!`);
        } catch (error) {
            console.error(error);
            return interaction.reply({content: 'Can not add to queue', flags: MessageFlags.Ephemeral});
        }
			
		
	},
};