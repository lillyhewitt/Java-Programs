/**
 * @fileoverview Discord slash command to display the highest win rate in the server.
 * @module leaderboardCommand
 */
const { SlashCommandBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

// Connect to DB
/**
 * Represents a connection to the SQLite database.
 * @type {sqlite3.Database}
 */

const db = new sqlite3.Database('./userdata.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});
//* query Users Win rate
/**
 * Queries the database to find the highest win rate among users.
 * @returns {Promise<number>} A Promise that resolves with the highest win rate.
 */

function queryHighestWinRate(){
    return new Promise((resolve,reject) => {
        let sql
        sql = ' SELECT MAX(win_rate) AS max_win_rate FROM users';
        db.all(sql, [], (err,rows)   => {
            if (err) {
                console.error(err.message);
                reject(err);
            }
                resolve(rows[0].max_win_rate);
        });
    });
    
}

module.exports = {
    /**
     * Slash command data.
     * @type {SlashCommandBuilder}
     */
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Displays the highest win rate in the server'),
    /**
     * Executes the leaderboard command.
     * @param {Object} interaction - The interaction object representing the command interaction.
     * @returns {Promise<void>} A Promise that resolves when the execution is complete.
     */
    async execute(interaction) {
        await interaction.reply('The highest win rate in the server is ' + (await queryHighestWinRate())+ '%' );
    },
};
