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
 * Updates the points for a user in the database after purchasing a reveal.
 * @param {number} points - The current points of the user.
 * @param {string} id - The unique identifier for a user.
 */
async function updatePointsAfterReveal(points, id){
    let sql = 'UPDATE users SET points = ? WHERE id = ?';
    let newTotal = (await points) - 50;
    db.run(sql, [newTotal, id], (err) =>{
        if (err) return console.error(err.message);
    });
}

//* UPDATE reveal
/**
 * Updates the number of reveals for a user in the database after purchasing a reveal.
 * @param {number} reveals - The current number of reveals of the user.
 * @param {string} id - The unique identifier for a user.
 */
async function updateReveal(reveals, id){
    let sql = 'UPDATE users SET reveals = ? WHERE id = ?';
    let newReveal = (await reveals) + 1;
    db.run(sql, [newReveal, id], (err) =>{
        if (err) return console.error(err.message);
    });
}

//* query reveals
/**
 * Queries the number of reveals for a specific user from the database.
 * @param {string} id - The unique identifier for a user.
 * @returns {Promise<number>} A promise that resolves with the number of reveals of the user.
 */
function queryReveal(id){
    return new Promise((resolve,reject) => {
        let sql
        sql = ' SELECT reveals FROM users WHERE id = ?';
        db.all(sql, [id], (err,rows)   => {
            if (err) {
                console.error(err.message);
                reject(err);
            }
                resolve(rows[0].reveals);
        });
    });
}

// implement /buy_reveal
module.exports = {
    /**
     * Slash command data.
     * @type {SlashCommandBuilder}
     */
    data: new SlashCommandBuilder()
        .setName('buy_reveal')
        .setDescription('Purchase a feature to reveal the first letter in a game.'),

     /**
     * Executes the slash command to allow users to purchase a reveal for a game.
     * @param {Object} interaction - The interaction object provided by discord.js, representing the user's command.
     * @returns {Promise<void>} A Promise that resolves when the execution is complete.
     */
    async execute(interaction) {

        if((await queryPoints(interaction.user.id)) < 50){
            await interaction.reply('Sorry you do not have enough points to buy a reveal.');
        }else{
            //* they have purchased a reveal
            updateReveal(queryReveal(interaction.user.id),interaction.user.id);
            updatePointsAfterReveal(queryPoints(interaction.user.id),interaction.user.id);
            await interaction.reply('Congrats, you now have the first letter of the word revealed for game of your choice.');
        }

    },
};
