const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const { OpenAI } = require('openai');
const { apiKey } = require('../../config.json');
const sqlite3 = require('sqlite3').verbose();

//* Connect to DB
const db = new sqlite3.Database('./userdata.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});

//* Define the table schema
db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, username VARCHAR, wins INTEGER, losses INTEGER, points INTEGER, leader_score INTEGER, win_streak INTEGER, last_word VARCHAR, win_rate DECIMAL, guesses INTEGER, items INTEGER)');
});


//* Insert data into database
function insertUser(id, username, wins, losses, points, score, streak, lastWord, winRate, guesses, items) {
    let sql = 'INSERT INTO users(id, username, wins, losses, points, leader_score, win_streak, last_word, win_rate, guesses, items) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.run(sql, [id, username, wins, losses, points, score, streak,lastWord,winRate,guesses,items], (err) => {
        if (err) return console.error(err.message);
    });
}

//* Updates the users win rate
async function updateWinRate(wins, losses, id){
    let sql = 'UPDATE users SET win_rate = ? WHERE id = ?';
    let aWin = await wins;
    let aLoss = await losses;
    let newWinRate = (aWin/(aWin+aLoss)) * 100;

    db.run(sql, [newWinRate, id], (err) =>{
        if (err) return console.error(err.message);
    });
}

//* UPDATE WINS
async function updateWin(win, id){
    let sql = 'UPDATE users SET wins = ? WHERE id = ?';
    let newWin = await win;
    newWin = newWin + 1;
    db.run(sql, [newWin, id], (err) =>{
        if (err) return console.error(err.message);
    });
}
//* UPDATE LOSSES
async function updateLoss(losses, id){
    let sql = 'UPDATE users SET losses = ? WHERE id = ?';
    let newLoss = await losses;
    newLoss = newLoss + 1;
    db.run(sql, [newLoss, id], (err) =>{
        if (err) return console.error(err.message);
    });
}
// * update user's streak
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
//* UPDATE points
async function updatePoints(points, id){
    let sql = 'UPDATE users SET points = ? WHERE id = ?';
    let newTotal = await points;
    newTotal = newTotal + 1;
    db.run(sql, [newTotal, id], (err) =>{
        if (err) return console.error(err.message);
    });
}
//* UPDATE last word
async function updateLastWords(lastWord, id){
    let sql = 'UPDATE users SET last_word = ? WHERE id = ?';
    let newWord = await lastWord;;
    
    db.run(sql, [newWord, id], (err) =>{
        if (err) return console.error(err.message);
    });
}

//* DELETE data
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
export {
    db,
    insertUser,
    updateLastWords,
    updateLoss,
    updatePoints,
    updateStreak,
    updateWin,
    updateWinRate,
    queryWin,
    queryGuesses,
    queryItems,
    queryLoss,
    queryPoints,
    queryWinStreak,
    queryWinRate,
};
