const { SlashCommandBuilder } = require('discord.js');
/**
 * Module exports a Discord slash command.
 * @module nameCommand
 */
module.exports = {
    /**
     * Slash command data.
     * @type {SlashCommandBuilder}
     */
    data: new SlashCommandBuilder()
        .setName('name')
        .setDescription('returns your discord name~'),
      /**
     * Executes the slash command that sends back the user's Discord username.
     * @param {Object} interaction - The interaction object provided by discord.js, representing the interaction.
     * @returns {Promise<void>} A Promise that resolves when the execution is complete.
     */
    async execute(interaction) {
        await interaction.reply(`Hi ${interaction.user.username}`);
    },
};
