/* --------------------------------- Modules -------------------------------- */
const fs = require('fs');
const axios = require('axios');
const ini = require('ini');

/* --------------------------- Getting Config File -------------------------- */
const config = ini.parse(fs.readFileSync('config.ini', 'utf-8'));

/* ------------------------ Setting Config Variables ------------------------ */
const outputFile = config.OUTPUT_FILE;

const allowUnderscores = config.GEN_USE_UNDERSCORE;
const allowNumbers = config.GEN_USE_NUMBERS;
const allowLetters = config.GEN_USE_LETTERS;

const userLength = parseInt(config.GEN_USER_LENGTH, 10);
const userAmount = parseInt(config.GEN_USER_AMOUNT, 10);

/* ------------------------------- Log Output ------------------------------- */
var logA;
var logB;
var logC;

if (allowUnderscores == true){ logA = "with chances of having a underscore" } else { logA = "without underscores" };
if (allowNumbers == true){ logB = "with" } else { logB = "without" };
if (allowLetters == true){ logC = "with" } else { logC = "without" };

console.log(`Generating ${userAmount} ${userLength} character user(s) ${logA}, ${logB} numbers, and ${logC} letters`)

/* -------------------- Helping Functions For Generation -------------------- */
function getRandomCharacter(choices) {
    return choices[Math.floor(Math.random() * choices.length)];
}

function generateUsername() {
    let characters = '';
    if (allowLetters) characters += 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (allowNumbers) characters += '0123456789';
    if (allowUnderscores) characters += '_';

    if (characters.length === 0) {
        throw new Error('No characters available for username generation. Check your configuration settings.');
    }

    let username = '';
    let hasUnderscore = false;

    for (let i = 0; i < userLength; i++) {
        let char;
        if (allowUnderscores && Math.random() < 1 / userLength && !hasUnderscore && i > 0 && i < userLength - 1) {
            char = '_';
            hasUnderscore = true;
        } else {
            char = getRandomCharacter(characters);
        }
        username += char;
    }

    return username;
}

function generateUsernames(count) {
    const usernames = [];
    for (let i = 0; i < count; i++) {
        usernames.push(generateUsername());
    }
    fs.writeFileSync(outputFile, usernames.join('\n'));
}

generateUsernames(userAmount);