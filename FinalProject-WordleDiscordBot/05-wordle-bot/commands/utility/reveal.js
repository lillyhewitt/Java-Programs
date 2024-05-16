const { SlashCommandBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
let randomWord = require('./startwordle.js');

//* Connect to USER DB
/**
 * Represents a connection to the SQLite database for user data.
 * @type {sqlite3.Database}
 */
const db = new sqlite3.Database('./userdata.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});

//* query reveals
/**
 * Queries the number of reveals available to a user.
 * @param {string} id - The unique identifier for the user.
 * @returns {Promise<number>} A promise that resolves with the number of reveals the user has.
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
//* UPDATE reveal
/**
 * Updates the reveal count for a user after a reveal is used.
 * @param {Promise<number>} reveal - The current number of reveals the user has.
 * @param {string} id - The unique identifier for the user.
 */
async function updateAfterReveal(reveal, id){
    let sql = 'UPDATE users SET reveals = ? WHERE id = ?';
    let newReveal = await reveal;
    newReveal = newReveal - 1;
    db.run(sql, [newReveal, id], (err) =>{
        if (err) return console.error(err.message);
    });
}
/**
 * Queries the last word that was used in the game for a user.
 * @param {string} id - The unique identifier for the user.
 * @returns {Promise<string>} A promise that resolves with the last word used in the game.
 */
function queryLastWord(id){
    return new Promise((resolve,reject) => {
        let sql
        sql = ' SELECT last_word FROM users WHERE id = ?';
        db.all(sql, [id], (err,rows)   => {
            if (err) {
                console.error(err.message);
                reject(err);
            }
                resolve(rows[0].last_word);
        });
    });
}
module.exports = {

    /**
     * Slash command data.
     * @type {SlashCommandBuilder}
     */
    data: new SlashCommandBuilder()
        .setName('reveal')
        .setDescription('Reveal the first letter of the word in your next  game.'),

         /**
     * Executes the reveal command to reveal the first letter of the word in the user's next game.
     * @param {Object} interaction - The interaction object provided by discord.js, representing the user's command.
     * @returns {Promise<void>} A Promise that resolves when the execution is complete.
     */
    async execute(interaction) {
        if((await queryReveal(interaction.user.id)) > 0){
            updateAfterReveal(queryReveal(interaction.user.id),interaction.user.id);
            let wordOfDay = (await queryLastWord(1));
            const squareArray = [];
            squareArray.push(':green_square:');
            for (let i=0; i<4; i++){
                squareArray.push(':black_large_square:');
            }
            await interaction.reply('Revealing the first letter of the word in your next game:\n ' + (wordOfDay[0])+'\n' + squareArray.join("")+ '\nYou now have ' + (await queryReveal(interaction.user.id))+ ' reveals left');
        }
        else{
            await interaction.reply('You do not have a reveal.');
        }
    },
};
