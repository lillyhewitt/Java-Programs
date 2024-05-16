const { SlashCommandBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

//* Connect to USER DB
/**
 * Represents a connection to the SQLite database for user data.
 * @type {sqlite3.Database}
 */
const db = new sqlite3.Database('./userdata.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
});

//* query extraPoints
/**
 * Queries the number of extra points for a specific user from the database.
 * @param {string} id - The unique identifier for a user.
 * @returns {Promise<number>} A promise that resolves with the number of extra points of the user.
 */
function queryExtraPoints(id){
    return new Promise((resolve,reject) => {
        let sql = 'SELECT extraPoints FROM users WHERE id = ?';
        db.get(sql, [id], (err,row)   => {
            if (err) {
                console.error(err.message);
                reject(err);
            } else {
                resolve(rows[0].extraPoints);
            }
        });
    });
}

//* UPDATE extraPoints
/**
 * Updates the number of extra points for a user in the database after redeeming 100 extra points.
 * @param {number} extraPoints - The current number of extra points of the user.
 * @param {string} id - The unique identifier for a user.
 */
async function updateAfterExtraPoints(extraPoints, id){
    let sql = 'UPDATE users SET extraPoints = ? WHERE id = ?';
    let newExtraPoints = await extraPoints - 1;
    db.run(sql, [newExtraPoints, id], (err) =>{
        if (err) {
            console.error(err.message);
        }
    });
}

//* query checkExtraPoints
/**
 * Queries the number of times the user has checked for extra points.
 * @param {string} id - The unique identifier for a user.
 * @returns {Promise<number>} A promise that resolves with the number of times the user has checked for extra points.
 */
function queryCheckExtraPoints(id){
    return new Promise((resolve,reject) => {
        let sql = 'SELECT checkExtraPoints FROM users WHERE id = ?';
        db.get(sql, [id], (err,row)   => {
            if (err) {
                console.error(err.message);
                reject(err);
            } else {
                resolve(rows[0].checkExtraPoints);
            }
        });
    });
}

//* UPDATE checkExtraPoints
/**
 * Updates the number of times the user has checked for extra points in the database.
 * @param {number} checkExtraPoints - The current number of times the user has checked for extra points.
 * @param {string} id - The unique identifier for a user.
 */
async function updateAfterCheckExtraPoints(checkExtraPoints, id){
    let sql = 'UPDATE users SET checkExtraPoints = ? WHERE id = ?';
    let newCheckExtraPoints = await checkExtraPoints + 1;
    db.run(sql, [newCheckExtraPoints, id], (err) =>{
        if (err) {
            console.error(err.message);
        }
    });
}

// implement /extra_points
module.exports = {
    /**
     * Slash command data.
     * @type {SlashCommandBuilder}
     */
    data: new SlashCommandBuilder()
        .setName('extra_points')
        .setDescription('Get 100 extra points in your next  game.'),

     /**
     * Executes the slash command to allow users to redeem 100 extra points for their next game.
     * @param {Object} interaction - The interaction object provided by discord.js, representing the user's command.
     * @returns {Promise<void>} A Promise that resolves when the execution is complete.
     */
    async execute(interaction) {
        try {
            const extraPoints = await queryExtraPoints(interaction.user.id);
            if(extraPoints > 0){
                await updateAfterExtraPoints(extraPoints, interaction.user.id);
                const checkExtraPoints = await queryCheckExtraPoints(interaction.user.id);
                await updateAfterCheckExtraPoints(checkExtraPoints, interaction.user.id);
                await interaction.reply('You have redeemed 100 extra points for your next game.');
            } else {
                await interaction.reply('You do not have the extra 100 points feature.');
            }
        } catch (error) {
            console.error(error.message);
            await interaction.reply('An error occurred while processing your request.');
        }
    },
};
