onst { SlashCommandBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
let numGuesses = require('./startwordle.js');


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
 * Updates the points for a user in the database after purchasing an extra guess.
 * @param {number} points - The current points of the user.
 * @param {string} id - The unique identifier for a user.
 */
async function updatePointsAfterGuess(points, id){
    let sql = 'UPDATE users SET points = ? WHERE id = ?';
    let newTotal = (await points) - 100;
    db.run(sql, [newTotal, id], (err) =>{
        if (err) return console.error(err.message);
    });
}

//* UPDATE guess
/**
 * Updates the number of guesses for a user in the database after purchasing an extra guess.
 * @param {number} guesses - The current number of guesses of the user.
 * @param {string} id - The unique identifier for a user.
 */
async function updateGuess(guesses, id){
    let sql = 'UPDATE users SET guesses = ? WHERE id = ?';
    let newGuesses = (await guesses) + 1;
    db.run(sql, [newGuesses, id], (err) =>{
        if (err) return console.error(err.message);
    });
}

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

// implement /buy_extra_guess
module.exports = {
    /**
     * Slash command data.
     * @type {SlashCommandBuilder}
     */
    data: new SlashCommandBuilder()
        .setName('buy_extra_guess')
        .setDescription('Purchase an extra guess for game.'),
        
         /**
     * Executes the slash command to allow users to purchase an extra guess for a game.
     * @param {Object} interaction - The interaction object provided by discord.js, representing the user's command.
     * @returns {Promise<void>} A Promise that resolves when the execution is complete.
     */
    async execute(interaction) {
        if((await queryPoints(interaction.user.id)) < 100){
            await interaction.reply('Sorry you do not have enough points to buy a guess');
        }else{
            updateGuess(queryGuess(interaction.user.id),interaction.user.id);
            updatePointsAfterGuess(queryPoints(interaction.user.id), interaction.user.id);
            //* fix this to increment guesses
            numGuesses++;
            await interaction.reply('Congrats, you now have an extra guess for a game of your choice.');
        }

    },
};
