const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { useMainPlayer } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder().setName('play').setDescription('Play a song in voice channel').addStringOption(option => option.setName('song').setDescription('Play the song selected').setRequired(true)),

    async execute(interaction){
        const player = useMainPlayer();
        const query = interaction.options.getString('song', true);

        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({context: 'You need to be in voice channel to play music!', flags: MessageFlags.Ephemeral});
        }
    }
};