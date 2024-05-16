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

let wageredAmount;
// query User's points
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

// update the betting amount in DB
/**
 * Updates the betting amount for a user in the database.
 * @param {string} betting - The user response if betting or not
 * @param {string} id - The unique identifier for a user.
 */
async function updateBetting(betting, id){
    let sql = 'UPDATE users SET betting = ? WHERE id = ?';
    db.run(sql, [betting, id], (err) =>{
        if (err) return console.error(err.message);
    });
}

// implement /bet 
module.exports = {

    /**
     * Slash command data.
     * @type {SlashCommandBuilder}
     */

    data: new SlashCommandBuilder()
        .setName('bet')
        .setDescription('Allows users to wager points on the game.'),

         /**
     * Executes the slash command to initiate betting points.
     * @param {Object} interaction - The interaction object provided by discord.js, representing the user's command.
     * @returns {Promise<void>} A Promise that resolves when the execution is complete.
     */
    async execute(interaction) {
        await interaction.reply(`Hi, ${interaction.user}. Wager points. Beware: you may double your points or lose what you wagered. Answer with "yes" or "no" '`);
   
        console.log(interaction.user.id);
        const collectorFilter = message => message.content.length < 4 && interaction.user == message.author;
        const collector = interaction.channel.createMessageCollector({ filter: collectorFilter, time: 90000 });

        collector.on('collect', async (betValue) => {
            betAns = (betValue.content);
            interaction.followUp(`Your answer was ${betAns}.You are now betting all your points.`);
            console.log(betAns);
            updateBetting((await betAns), interaction.user.id);
            collector.stop();
        });

        collector.on('end', collected => {
            // store information about whether the person won or not, points awarded, etc.
            console.log(`Collected ${collected.size} items`);
        });
    },
};
