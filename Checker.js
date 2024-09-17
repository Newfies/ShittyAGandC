/* --------------------------------- Modules -------------------------------- */
const fs = require('fs');
const axios = require('axios');
const ini = require('ini');

/* --------------------------- Getting Config File -------------------------- */
const config = ini.parse(fs.readFileSync('config.ini', 'utf-8'));

/* ------------------------ Setting Config Variables ------------------------ */
const checkFile = config.CHECK_FILE;
const verifiedFile = config.VERIFIED_FILE;
const badUsersFile = config.BAD_USERS_FILE;
const apiUrl1 = config.API_URL1;
const apiUrl2 = config.API_URL2;

/* -------------------- Helper Function for API Request -------------------- */
async function checkUsername(username) {
    try {
        const response = await axios.get(apiUrl1 + encodeURIComponent(username) + apiUrl2);
        console.log(`API response for ${username}:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error checking username ${username}:`, error.message);
        return null;
    }
}

/* ----------------------- Process Usernames ------------------------------- */
async function processUsernames() {
    const usernames = fs.readFileSync(checkFile, 'utf-8').split('\n').map(line => line.trim());

    const verifiedUsernames = [];
    const badUsernames = [];

    for (const username of usernames) {
        console.log(`Checking username: ${username}`);
        const result = await checkUsername(username);

        if (result) {
            // Process response based on the single object format
            if (result.message === 'Username is valid') {
                verifiedUsernames.push(username);
            } else {
                const reason = result.message || 'Unknown reason';
                badUsernames.push(`${username} - ${reason}`);
            }
        } else {
            badUsernames.push(`${username} - Error checking username`);
        }
    }

    fs.writeFileSync(verifiedFile, verifiedUsernames.join('\n'));
    fs.writeFileSync(badUsersFile, badUsernames.join('\n'));

    console.log(`Verified usernames saved to ${verifiedFile}`);
    console.log(`Bad usernames saved to ${badUsersFile}`);
}

// Run the process
processUsernames().catch(err => console.error('Error processing usernames:', err));
