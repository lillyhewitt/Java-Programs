const { SlashCommandBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

// const { db } = require('./startwordle.js'); 

//* Connect to DB

/**
 * Represents a connection to the SQLite database.
 * @type {sqlite3.Database}
 */
const db = new sqlite3.Database('./userdata.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});

// query users points
/**
 * Queries the number of points a user has from the database.
 * @param {string} id - The user's unique identifier.
 * @returns {Promise<number>} A promise that resolves with the number of points the user has.
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

// implement /points
    /**
     * Executes the slash command to send a message to the user showing their current points.
     * @param {Object} interaction - The interaction object provided by discord.js, representing the user's command.
     */
    
module.exports = {
    /**
     * Slash command data.
     * @type {SlashCommandBuilder}
     */
    data: new SlashCommandBuilder()
        .setName('points')
        .setDescription('Display the current points of the user'),

    /**
     * Executes the slash command to send a message to the user showing their current points.
     * @param {Object} interaction - The interaction object provided by discord.js, representing the user's command.
     * @returns {Promise<void>} A Promise that resolves when the execution is complete.
     */
    async execute(interaction) {
        await interaction.reply('You currently have ' + await queryPoints(interaction.user.id) +' points');
    },
};
