const { SlashCommandBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
const ADMIN = 1;

//* Connect to USER DB
/**
 * Represents a connection to the SQLite database for user data.
 * @type {sqlite3.Database}
 */
const db = new sqlite3.Database('./userdata.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});

// query points
/**
 * Queries the points for a specific user from the database.
 * @param {string} id - The unique identifier for a user.
 * @returns {Promise<number>} A promise that resolves with the points of the user.
 */
function queryPoints(id){
    return new Promise((resolve,reject) => {
        let sql
        sql = ' SELECT points FROM users WHERE id = ?';
        db.all(sql, [id], (err,rows)   => {
            if (err) {
                console.error(err.message);
                reject(err);
            }
                resolve(rows[0].points);
        });
    });
}

// implement /daily
module.exports = {
    /**
     * Slash command data.
     * @type {SlashCommandBuilder}
     */
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('See the amount of points available for the day.'),
    
      /**
     * Executes the slash command to display the amount of points available for the day.
     * @param {Object} interaction - The interaction object provided by discord.js, representing the user's command.
     * @returns {Promise<void>} A Promise that resolves when the execution is complete.
     */
    async execute(interaction) {
        await interaction.reply('The amount of points available today is ' + (await queryPoints(ADMIN)) + ' points.');
    },
};
