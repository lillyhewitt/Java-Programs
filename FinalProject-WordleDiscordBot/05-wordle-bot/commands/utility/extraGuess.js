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

//* query guesses
/**
 * Queries the number of guesses for a specific user from the database.
 * @param {string} id - The unique identifier for a user.
 * @returns {Promise<number>} A promise that resolves with the number of guesses of the user.
 */
function queryGuess(id){
    return new Promise((resolve,reject) => {
        let sql
        sql = ' SELECT guesses FROM users WHERE id = ?';
        db.all(sql, [id], (err,rows)   => {
            if (err) {
                console.error(err.message);
                reject(err);
            }
                resolve(rows[0].guesses);
        });
    });
}

/**
 * Queries the number of items for a specific user from the database.
 * @param {string} id - The unique identifier for a user.
 * @returns {Promise<number>} A promise that resolves with the number of items of the user.
 */
function queryItems(id){
    return new Promise((resolve,reject) => {
        let sql
        sql = ' SELECT items FROM users WHERE id = ?';
        db.all(sql, [id], (err,rows)   => {
            if (err) {
                console.error(err.message);
                reject(err);
            }
                resolve(rows[0].items);
        });
    });
}

/**
 * Updates the number of items for a user in the database after using an extra guess.
 * @param {number} items - The current number of items of the user.
 * @param {string} id - The unique identifier for a user.
 */
async function updateItem(items, id){
    let sql = 'UPDATE users SET items = ? WHERE id = ?';
    let newItems = await items;
    newItems = newItems + 1;
    db.run(sql, [newItems, id], (err) =>{
        if (err) return console.error(err.message);
    });
}

//* UPDATE guess
/**
 * Updates the number of guesses for a user in the database after using an extra guess.
 * @param {number} guesses - The current number of guesses of the user.
 * @param {string} id - The unique identifier for a user.
 */
async function updateAfterGuess(guesses, id){
    let sql = 'UPDATE users SET guesses = ? WHERE id = ?';
    let newGuesses = (await guesses) - 1;
    db.run(sql, [newGuesses, id], (err) =>{
        if (err) return console.error(err.message);
    });
}
module.exports = {
    /**
     * Slash command data.
     * @type {SlashCommandBuilder}
     */
    data: new SlashCommandBuilder()
        .setName('extra_guess')
        .setDescription('Use an extra guess for your next game.'),

     /**
     * Executes the slash command to allow users to use an extra guess for their next game.
     * @param {Object} interaction - The interaction object provided by discord.js, representing the user's command.
     * @returns {Promise<void>} A Promise that resolves when the execution is complete.
     */
    async execute(interaction) {
        if((await queryGuess(interaction.user.id)) > 0){
            updateAfterGuess(queryGuess(interaction.user.id),interaction.user.id);
            updateItem(queryItems(interaction.user.id),interaction.user.id);
            await interaction.reply('Using an extra guess for your next game.');
        }
        else{
            await interaction.reply('You do not have any guesses.');
        }
    },
};
