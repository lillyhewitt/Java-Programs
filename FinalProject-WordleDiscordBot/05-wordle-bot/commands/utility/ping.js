const { SlashCommandBuilder } = require('discord.js');
/**
 * Module exports a Discord slash command.
 * @module pingCommand
 */
module.exports = {
     /**
     * Slash command data.
     * @type {SlashCommandBuilder}
     */
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
      /**
     * Executes the slash command to send back a "Pong!" response.
     * @param {Object} interaction - The interaction object provided by discord.js, representing the user's command.
     * @returns {Promise<void>} A Promise that resolves when the execution is complete.
     */
    async execute(interaction) {
        await interaction.reply('Pong!');
    },
};
