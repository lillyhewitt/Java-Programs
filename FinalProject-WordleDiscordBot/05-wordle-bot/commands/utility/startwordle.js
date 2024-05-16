const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const { OpenAI } = require('openai');
const { apiKey } = require('../../config.json');
const bet = require('./bet');
const sqlite3 = require('sqlite3').verbose();
const ADMIN = 1;
//* Connect to USER DB
const db = new sqlite3.Database('./userdata.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});

//* Define the table schemas
db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, username VARCHAR, wins INTEGER, losses INTEGER, points INTEGER, leader_score INTEGER, win_streak INTEGER, last_word VARCHAR, win_rate DECIMAL, guesses INTEGER, items INTEGER, reveals INTEGER, extraPoints INTEGER, checkExtraPoints INTEGER, betting INTEGER)');
});

///* working on this func
/**
 * Generates a random number of points for the daily points.
 * @returns {number} A random number of points for the daily points.
 */
function setDailyPoints(){
    return Math.floor(Math.random() * 100);
}

/**
 * Inserts user data into the database.
 * @param {number} id - The user's ID.
 * @param {string} username - The user's username.
 * @param {number} wins - The user's number of wins.
 * @param {number} losses - The user's number of losses.
 * @param {number} points - The user's points.
 * @param {number} score - The user's score.
 * @param {number} streak - The user's win streak.
 * @param {string} lastWord - The user's last guessed word.
 * @param {number} winRate - The user's win rate.
 * @param {number} guesses - The user's number of guesses.
 * @param {number} items - The user's items.
 * @param {number} reveals - The user's reveals.
 * @param {number} betting - The user's betting status.
 */
//* Insert data into database
function insertUser(id, username, wins, losses, points, score, streak, lastWord, winRate, guesses, items, reveals, betting,) {
    let sql = 'INSERT INTO users(id, username, wins, losses, points, leader_score, win_streak, last_word, win_rate, guesses, items, reveals,betting,) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.run(sql, [id, username, wins, losses, points, score, streak,lastWord,winRate,guesses,items, reveals, betting], (err) => {
        if (err) return console.error(err.message);
    });
}

//* Updates the users win rate
/**
 * Updates the user's win rate.
 * @param {number} id - The user's ID.
 */
async function updateWinRate(id){
    let sql = 'UPDATE users SET win_rate = ? WHERE id = ?';
    let aWin = await queryWin(id);
    let aLoss = await queryLoss(id);
    let newWinRate = Math.floor((aWin/(aWin+aLoss)) * 100);

    db.run(sql, [newWinRate, id], (err) =>{
        if (err) return console.error(err.message);
    });
}


//* UPDATE WINS
/**
 * Updates the user's wins.
 * @param {number} win - The user's current number of wins.
 * @param {number} id - The user's ID.
 */
async function updateWin(win, id){
    let sql = 'UPDATE users SET wins = ? WHERE id = ?';
    let newWin = await win;
    newWin = newWin + 1;
    db.run(sql, [newWin, id], (err) =>{
        if (err) return console.error(err.message);
    });
}

//* UPDATE LOSSES
/**
 * Updates the user's losses.
 * @param {number} losses - The user's current number of losses.
 * @param {number} id - The user's ID.
 */
async function updateLoss(losses, id){
    let sql = 'UPDATE users SET losses = ? WHERE id = ?';
    let newLoss = await losses;
    newLoss = newLoss + 1;
    db.run(sql, [newLoss, id], (err) =>{
        if (err) return console.error(err.message);
    });
}

// * update user's streak
/**
 * Updates the user's win streak.
 * @param {number} streak - The user's current win streak.
 * @param {number} id - The user's ID.
 * @param {boolean} outcome - The outcome of the game.
 */
async function updateStreak(streak, id, outcome){
    let sql = 'UPDATE users SET win_streak = ? WHERE id = ?';
    let newStreak = await streak;
    if(outcome){
        newStreak = newStreak + 1;
    }
    else{
        newStreak = 0;
    }
    db.run(sql, [newStreak, id], (err) =>{
        if (err) return console.error(err.message);
    });
}

//* query checkExtraPoints
/**
 * Queries the user's checkExtraPoints.
 * @param {number} id - The user's ID.
 * @returns {Promise<number>} A Promise that resolves with the user's checkExtraPoints.
 */
function queryCheckExtraPoints(id){
    return new Promise((resolve,reject) => {
        let sql
        sql = ' SELECT checkExtraPoints FROM users WHERE id = ?';
        db.all(sql, [id], (err,rows)   => {
            if (err) {
                console.error(err.message);
                reject(err);
            }
                resolve(rows[0].reveals);
        });
    });
}

//* UPDATE extraPoints
/**
 * Updates the user's checkExtraPoints after using it.
 * @param {number} checkExtraPoints - The user's current checkExtraPoints.
 * @param {number} id - The user's ID.
 */
async function updateAfterUsingExtraPoints(checkExtraPoints, id){
    let sql = 'UPDATE users SET checkExtraPoints = ? WHERE id = ?';
    let newCheckExtraPoints = await checkExtraPoints;
    newCheckExtraPoints = newCheckExtraPoints - 1;
    db.run(sql, [newReveal, id], (err) =>{
        if (err) return console.error(err.message);
    });
}

//* UPDATE points
/**
 * Updates the user's points.
 * @param {number} points - The user's current points.
 * @param {string} betting - The user's betting status.
 * @param {number} id - The user's ID.
 * @param {boolean} win - The outcome of the game.
 * @param {number} checkExtraPoints - The user's current checkExtraPoints.
 */
async function updatePoints(points, betting, id, win, checkExtraPoints){
    let totalNewPoints;
    totalNewPoints = (await points);
    let bettingAnsw=await(betting);
    let addExtra = (await checkExtraPoints);
    console.log(bettingAnsw,win);

    if(win==false && bettingAnsw=="no"){
        return;
    }

    let sql = 'UPDATE users SET points = ? WHERE id = ?';
    // let newTotal = (await points) + Math.floor(Math.random() * 100);
    if(win && bettingAnsw=="yes"){
      
      totalNewPoints*=2;
    }
    else if (bettingAnsw=="yes" && win==false){
        totalNewPoints=0;
    }
    
    else{
        //this is wining and not betting with using the extra 100 feature
        if(addExtra == 1) { 
            totalNewPoints = (await points) + (await queryPoints(ADMIN)) + 100;
            updateAfterUsingExtraPoints(queryCheckExtraPoints(interaction.user.id),interaction.user.id);
        }
        // this is winning and not betting 
        else{
            totalNewPoints = (await points) + (await queryPoints(ADMIN));
        }
    }
    let sql2 = 'UPDATE users SET betting = "no" WHERE id = ?';
    db.run(sql2, [id], (err) =>{
        if (err) return console.error(err.message);
    });
    db.run(sql, [totalNewPoints, id], (err) =>{
        if (err) return console.error(err.message);
    });
}

//* UPDATE last word
/**
 * Updates the user's last word.
 * @param {string} lastWord - The user's last guessed word.
 * @param {number} id - The user's ID.
 */
async function updateLastWords(lastWord, id){
    let sql = 'UPDATE users SET last_word = ? WHERE id = ?';
    let newWord = await lastWord;;
    
    db.run(sql, [newWord, id], (err) =>{
        if (err) return console.error(err.message);
    });
}

//* DELETE data
/**
 * Deletes user data from the database.
 * @param {number} id - The user's ID.
 */
function deleteUser(id){
    let sql;
    sql = 'DELETE FROM users WHERE id = ?'
    db.run(sql, [id], (err) =>{
        if (err) return console.error(err.message);
    });
}

//* Query User data

function queryData(){
    let sql;
    sql = 'SELECT * FROM users';
    db.all(sql, [], (err, rows) => {
        if (err) return console.error(err.message);
        rows.forEach((row) => {
            console.log(row);
        });
    })
}

//* query Users Wins
/**
 * Queries the user's wins from the database.
 * @param {number} id - The user's ID.
 * @returns {Promise<number>} A Promise that resolves with the user's wins.
 */
function queryWin(id){
    return new Promise((resolve,reject) => {
        let sql
        sql = ' SELECT wins FROM users WHERE id = ?';
        db.all(sql, [id], (err,rows)   => {
            if (err) {
                console.error(err.message);
                reject(err);
            }
                resolve(rows[0].wins);
        });
    });
}

//* query Users Wins
/**
 * Queries the user's betting status from the database.
 * @param {number} id - The user's ID.
 * @returns {Promise<string>} A Promise that resolves with the user's betting status.
 */
function queryBetAnsw(id){
    return new Promise((resolve,reject) => {
        let sql
        sql = ' SELECT betting FROM users WHERE id = ?';
        db.all(sql, [id], (err,rows)   => {
            if (err) {
                console.error(err.message);
                reject(err);
            }
                resolve(rows[0].betting);
        });
    });
}

//* query Users guesses
/**
 * Queries the user's guesses from the database.
 * @param {number} id - The user's ID.
 * @returns {Promise<number>} A Promise that resolves with the user's guesses.
 */
function queryGuesses(id){
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

// * QUERY users reveals
/**
 * Queries the user's reveals from the database.
 * @param {number} id - The user's ID.
 * @returns {Promise<number>} A Promise that resolves with the user's reveals.
 */
function queryReveals(id){

    return new Promise((resolve,reject) => {
        let sql
        sql = ' SELECT reveals FROM users WHERE id = ?';
        db.all(sql, [id], (err,rows)   => {
            if (err) {
                console.error(err.message);
                reject(err);
            }
                resolve(rows[0].guesses);
        });
    });
}

//* query Users items
/**
 * Queries the user's items from the database.
 * @param {number} id - The user's ID.
 * @returns {Promise<number>} A Promise that resolves with the user's items.
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

//* query Users points
/**
 * Queries the user's points from the database.
 * @param {number} id - The user's ID.
 * @returns {Promise<number>} A Promise that resolves with the user's points.
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

//* query Users Win Streak
function queryWinStreak(id){
    return new Promise((resolve,reject) => {
        let sql
        sql = ' SELECT win_streak FROM users WHERE id = ?';
        db.all(sql, [id], (err,rows)   => {
            if (err) {
                console.error(err.message);
                reject(err);
            }
                resolve(rows[0].win_streak);
        });
    });
}

//* query Users Last Word
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

//* query Users Losses
function queryLoss(id){
    return new Promise((resolve,reject) => {
        let sql
        sql = ' SELECT losses FROM users WHERE id = ?';
        db.all(sql, [id], (err,rows)   => {
            if (err) {
                console.error(err.message);
                reject(err);
            }
                resolve(rows[0].losses);
        });
    });
    
}

//* query Users Win rate
function queryWinRate(id){
    return new Promise((resolve,reject) => {
        let sql
        sql = ' SELECT win_rate FROM users WHERE id = ?';
        db.all(sql, [id], (err,rows)   => {
            if (err) {
                console.error(err.message);
                reject(err);
            }
                resolve(rows[0].win_rate);
        });
    });
    
}

//* use ChatGPT to get a 5 letter word
async function getRandom5LetterWordFromChatgpt() {

    const openai = new OpenAI({
        apiKey: "Copy the API Key from config.json",
    });

    try {
        const chatCompletion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ 'role': 'user', 'content': 'Give me a random word that is exactly 5 letters long. Do not repeat the word in the consecutive queries I make.' }],
        });
        console.log(chatCompletion.choices[0].message);

        // Extract the word from the response
        const randomWord = chatCompletion.choices[0].message.content;
        console.log("Generated word:", randomWord);
        return randomWord.toLowerCase();
    }
    catch (error) {
        console.error('Error generating word:', error);
    }

}


//* update item
async function updateItem(items, id, used){
    let sql = 'UPDATE users SET items = ? WHERE id = ?';
    let newItems = await items;
    if(used){
        newItems = newItems -1;
    }
    else{
        newItems = newItems + 1;
    }
    db.run(sql, [newItems, id], (err) =>{
        if (err) return console.error(err.message);
    });
}


function getAbsenceEmoji(theme) {
    const absenceEmoji = {
        dark: ':white_large_square:',
        light: ':black_large_square:'
    };
    return absenceEmoji[theme] || absenceEmoji['dark']; // Default to dark if not specified
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('startwordle')
        .setDescription('starts a game of wordle~'),
    async execute(interaction) {
         //inserting user into db       
        insertUser(interaction.user.id,interaction.user.username,0,0,0,0,0," ",0.0,0,0,0,0,0,0);
        if((await queryLastWord(interaction.user.id)) == (await queryLastWord(ADMIN))) {
            await interaction.reply("You have already guessed today's word. Try again tommorow!");
            return;
        }
        const dictionary = fs.readFileSync('dictionary.txt', 'utf-8').split('\n').filter(word => word.length === 5).map(word => word.toLowerCase());
        await interaction.reply(`Hi, ${interaction.user}. Starting a game of Wordle (15 minute time limit).`);
        
        const theme = await queryTheme(interaction.user.id); 
        const absenceEmoji = getAbsenceEmoji(theme);

        const randomWord = (await queryLastWord(ADMIN));
        //const randomWord = dictionary[Math.floor(Math.random() * dictionary.length)];

        //const randomWord = dictionary[Math.floor(Math.random() * dictionary.length)];
        //uncomment the line below to use chatGPT & comment the above line

        // const randomWord = await getRandom5LetterWordFromChatgpt();
        let numGuesses = (await queryGuesses(ADMIN));
        //await interaction.followUp(randomWord);
        const collectorFilter = message => message.content.length == 5 && interaction.user == message.author;
        const collector = interaction.channel.createMessageCollector({ filter: collectorFilter, time: 90000 });
        const responseHistory = [];
        const guessHistory = [];

        collector.on('collect', async (guess) => {
            const guessContents = guess.content.toLowerCase();
            if (!dictionary.includes(guessContents)) {
                interaction.followUp('invalid guess, try again: ');
            }
            else if (guessHistory.includes(guessContents)) {
                interaction.followUp('repeat guess, try again: ');
            }
            else {
                //* v-- Logic for using an extra guess, still working on it
                if((await queryItems(interaction.user.id)) > 0){
                    numGuesses++;
                    updateItem(queryItems(interaction.user.id),interaction.user.id,true);
                }
                numGuesses--;
                interaction.followUp(`your guess is ${guess.content}.`);
                // now handle the guesses
                const squareArray = [];
                for (let i = 0; i < guessContents.length; i++) {
                    if (guessContents[i] === randomWord[i]) {
                        squareArray.push(':green_square:');
                    }
                    else if (randomWord.includes(guessContents[i])) {
                        squareArray.push(':yellow_square:');
                    }
                    // need to handle edge case for dupes (use count of letters)
                    else {
                        squareArray.push(absenceEmoji);
                    }
                }
                let letter_square_combo = '';
                letter_square_combo += (guessContents[0]);
                for (let i = 1; i < guessContents.length; i++) {
                    letter_square_combo += ('     ' + guessContents[i]);
                }
                letter_square_combo += '\n';
                for (let i = 0; i < squareArray.length; i++) {
                    letter_square_combo += squareArray[i];
                }
                guessHistory.push(guessContents);
                responseHistory.push(letter_square_combo);
                let response = '';
                for (let i = 0; i < responseHistory.length; i++) {
                    response += responseHistory[i];
                    response += '\n';
                }
                await interaction.followUp(response);
                if (guessContents == randomWord) {
                    interaction.followUp('you win');
                    updateLastWords(randomWord,interaction.user.id);
                    updateWin(queryWin(interaction.user.id),interaction.user.id);
                    updateStreak(queryWinStreak(interaction.user.id),interaction.user.id,true);
                    updateWinRate(interaction.user.id);
                    updatePoints(queryPoints(interaction.user.id),queryBetAnsw(interaction.user.id), interaction.user.id,true);
                    collector.stop();
                }
                else if (numGuesses == 0) {
                    interaction.followUp(`you lose. the word was ${randomWord}`);
                    updateLoss(queryLoss(interaction.user.id),interaction.user.id);
                    updateLastWords(randomWord,interaction.user.id);
                    updateStreak(queryWinStreak(interaction.user.id),interaction.user.id,false);
                    updateWinRate(interaction.user.id);
                    updatePoints(queryPoints(interaction.user.id),queryBetAnsw(interaction.user.id), interaction.user.id,false);
                    collector.stop();
                }

            }
        });

        // handle "time-out" situations -- if no time left, then they automatically lose
        collector.on('end', collected => {
            // store information about whether the person won or not, points awarded, etc.
            console.log(`Collected ${collected.size} items`);
        });
    },
};
