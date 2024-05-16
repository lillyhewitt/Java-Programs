const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    /**
     * Slash command data.
     * @type {SlashCommandBuilder}
     */
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('Provides store items for game.'),

     /**
     * Executes the slash command to list store items that players can buy using in-game points.
     * @param {Object} interaction - The interaction object provided by discord.js, representing the user's command.
     * @returns {Promise<void>} A Promise that resolves when the execution is complete.
     */
    async execute(interaction) {
        await interaction.reply('Use your points to buy:\n\tUse /buy_extra_guess to buy an extra guess in a game for 100 points.\n\tUse /buy_extra_points to get 100 extra points in a game for 75 points.\n\tUse /buy_reveal to reveal the first letter of a word for 50 points.\nImportant: must use store items before starting the game you want to use the extra feature on.');
    },
};
