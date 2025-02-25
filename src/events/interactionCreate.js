const { Events, Collection, MessageFlags } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		// return object of command info
		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching: ${interaction.commandName}`);
			return;
		}

		try {
			// Cooldown checking
			// get the cooldowns command collection
			const { cooldowns } = interaction.client;

			// check if the command name is exist in the collection, if not then add to collection
			if (!cooldowns.get(command.data.name)) {
				cooldowns.set(command.data.name, new Collection());
			}

			const now = Date.now();
			const timestamps = cooldowns.get(command.data.name);
			const defaultCoolDown = 3;
			const coolDownDuration = (command.cooldown ?? defaultCoolDown) * 1000;

			// if timestamps contain user id for the yinteraction the do the checking else set the timestamp
			if (timestamps.has(interaction.user.id)) {
				const expiredTimeStamp = timestamps.get(interaction.user.id) + coolDownDuration;
				const expiredTime = Math.round(expiredTimeStamp / 1000);

				if (now < expiredTimeStamp) {
					interaction.reply({ content:`${command.data.name} in cooldown please try again after <t:${expiredTime}:R>`, flags: MessageFlags.Ephemeral });
					return;
				}
			}

			// Set the timestamp as current time
			timestamps.set(interaction.user.id, now);

			// If the command is run for the first time or after expried time
			// Create new timestamp

			timestamps.set(interaction.user.id, now);
			// Delete the timestamp after expried
			setTimeout(() => timestamps.delete(interaction.user.id), coolDownDuration);

			// Execute the command
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
	},
};