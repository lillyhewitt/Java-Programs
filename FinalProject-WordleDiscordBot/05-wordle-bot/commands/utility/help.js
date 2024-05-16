const { SlashCommandBuilder } = require('discord.js');
/**
 * Slash command data for providing a manual page for the game.
 * @type {SlashCommandBuilder}
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Provides manual page for game'),

    
    /**
     * Executes the slash command to provide a manual page for the game.
     * @param {Object} interaction - The interaction object provided by discord.js, representing the user's command.
     * @returns {Promise<void>} A Promise that resolves when the execution is complete.
     */
    async execute(interaction) {
        await interaction.reply('Features include:\n\tUse /startwordle to begin the game.\n\tUse /leaderboard to display the highest win rates in the server.\n\tUse /daily to show available points.\n\tUse /streak to display the higest win streak in the server.\n\tUse /bet to wager points on a game.\n\tUse /points to check your current points.\n\tUse /shop to view shop features.\n\tUse /buy to buy from the shop.');
    },
};
