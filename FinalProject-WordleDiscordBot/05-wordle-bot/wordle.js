// objective: make a wordle program!!
const fs = require('node:fs');
const readline = require('readline');
const prompt = require('prompt-sync')();
const { OpenAI } = require("openai");

async function wordArray() {
    const fileStream = fs.createReadStream('dictionary.txt');
    // from https://stackoverflow.com/questions/6156501/read-a-file-one-line-at-a-time-in-node-js
    const lineReader = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    const array = [];
    for await (const line of lineReader) {
        // wordles are five letter words
        if (line.length == 5) {
            array.push(line.toUpperCase());
        }
    }
    return array;
}

async function guessMaker(array) {
    let guess = prompt('Guess a five letter word: ').toUpperCase();
    while (guess.length != 5) {
        if (guess.length != 5) {
            guess = prompt('Word not of correct length, please input again: ').toUpperCase();
        }
        else if (!array.includes(guess)) {
            guess = prompt('Word not found, please input again: ').toUpperCase();
        }
    }
    return guess;
}

async function getRandom5LetterWordFromChatgpt() {

    const openai = new OpenAI({
        apiKey: 'API_SECRET_KEY'
    });

    try {
        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{"role": "user", "content": "Give me a random word that is exactly 5 letters long."}],
          });
          console.log(chatCompletion.choices[0].message);

        // Extract the word from the response
        const randomWord = chatCompletion.choices[0].message.content
        
        // console.log("Generated word:", randomWord);
        return randomWord.trim().toUpperCase()
         
    } catch (error) {
        console.error("Error generating word:", error);
    }

}

// helper method to count number of G (correct) in a word
async function countCorrect(word) {
    let gCount = 0;
    for (let i = 0; i < word.length; i++) {
        if (word.charAt(i) == 'G') {
            gCount += 1;
        }
    }
    return gCount;
}
// modify this for discord interface
// will have to modify in the future to accept shop parameters
async function main() {
    const array = await wordArray();
    // const randomWord = array[Math.floor(Math.random() * array.length)];
    const randomWord = await getRandom5LetterWordFromChatgpt()
    // console.log("retruned " +  randomWord)
    let numGuesses = 6;
    let numLetters = 5;

    while (numGuesses > 0) {
        const guess = (await guessMaker(array)).toString();

        // now compare word to guess
        /*
            for now:
            'G' (green) = right letter, right place
            'Y' (yellow) = right letter, wrong place
            'X' (gray) = wrong letter
        */
        let resultString = '';
        for (let i = 0; i < guess.length; i++) {
            if (guess.charAt(i) == randomWord.charAt(i)) {
                resultString += 'G';
            }
            else if (randomWord.includes(guess.charAt(i))) {
                resultString += 'Y';
            }
            else {
                resultString += 'X';
            }
        }
        console.log(resultString);
        numLetters = 5 - (await countCorrect(resultString));
        numGuesses = numGuesses - 1;
        if (numLetters == 0) {
            break;
        }

    }

    if (numLetters == 0) {
        console.log('you\'ve won, the word is ' + randomWord);
    }
    else {
        console.log('you\'ve lost, the word is ' + randomWord);
    }
}

main();
