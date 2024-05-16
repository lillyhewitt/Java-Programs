const { SlashCommandBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

//* Connect to USER DB
/**
 * Represents a connection to the SQLite database for user data.
 * @type {sqlite3.Database}
 */
const db = new sqlite3.Database('./userdata.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});

//* query points
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

//* UPDATE points
/**
 * Updates the points for a user in the database after purchasing extra points.
 * @param {number} points - The current points of the user.
 * @param {string} id - The unique identifier for a user.
 */
async function updatePointsAfterExtraPoints(points, id){
    let sql = 'UPDATE users SET points = ? WHERE id = ?';
    let newTotal = (await points) - 75;
    db.run(sql, [newTotal, id], (err) =>{
        if (err) return console.error(err.message);
    });
}

//* query extraPoints
/**
 * Queries the extra points for a specific user from the database.
 * @param {string} id - The unique identifier for a user.
 * @returns {Promise<number>} A promise that resolves with the extra points of the user.
 */
function queryExtraPoints(id){
    return new Promise((resolve,reject) => {
        let sql
        sql = ' SELECT extraPoints FROM users WHERE id = ?';
        db.all(sql, [id], (err,rows)   => {
            if (err) {
                console.error(err.message);
                reject(err);
            }
                resolve(rows[0].extraPoints);
        });
    });
}

//* UPDATE extraPoints
/**
 * Updates the extra points for a user in the database after purchasing extra points.
 * @param {number} extraPoints - The current extra points of the user.
 * @param {string} id - The unique identifier for a user.
 */
async function updateExtraPoints(extraPoints, id){
    let sql = 'UPDATE users SET extraPoints = ? WHERE id = ?';
    let newExtraPoints = (await extraPoints) + 1;
    db.run(sql, [newExtraPoints, id], (err) =>{
        if (err) return console.error(err.message);
    });
}

module.exports = {
    /**
     * Slash command data.
     * @type {SlashCommandBuilder}
     */
    data: new SlashCommandBuilder()
        .setName('buy_extra_points')
        .setDescription('Purchase 100 extra points for a game.'),
        
        /**
     * Executes the slash command to allow users to purchase extra points for a game.
     * @param {Object} interaction - The interaction object provided by discord.js, representing the user's command.
     * @returns {Promise<void>} A Promise that resolves when the execution is complete.
     */
    async execute(interaction) {
        if((await queryPoints(interaction.user.id)) < 75){
            await interaction.reply('Sorry you do not have enough points to buy double points.');
        }else{
            // they have purchases extra 100 points
            await updateExtraPoints(queryExtraPoints(interaction.user.id),interaction.user.id);
            await updatePointsAfterExtraPoints(queryPoints(interaction.user.id), interaction.user.id);
            await interaction.reply('Congrats, you now have double points for a game of your choice.');
        }

    },
};
