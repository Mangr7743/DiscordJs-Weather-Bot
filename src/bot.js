// Setup env variables 
//require("dotenv").config();

// import https
const https = require('https');

// Import class
const { Client } = require("discord.js");

// Create new instance
const client = new Client();

// Setup command prefix
const PREFIX = "$";

// Register events
client.on('ready', () => {
    console.log(`${client.user.username} has logged in and is online!`);
});

client.on('message', (message) => {
    // Avoid bot from causing any commands
    if (message.author.bot) return;

    // Check for message prefix
    if (message.content.startsWith(PREFIX)) {
        // Split message into command and arugments using spread operator
        const [CMD_NAME, ...args] = message.content
        .trim()
        .substring(PREFIX.length)
        .split(/\s+/);
        console.log(CMD_NAME);
        console.log(args);

        if (CMD_NAME === 'weather' || CMD_NAME === 'Weather') {
            if (args.length === 0) return message.reply("Please enter a city name!");
            console.log(args.length);

            let query = "";

            // Concatenate string froms args array
            for (let i = 0; i < args.length; i++) {
                query = query + args[i];
                if (i < args.length-1) {
                    query = query + " ";
                }
            }

            // Make api call
            const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + process.env.API_KEY + "&units=metric";


            https.get(url, (response) => {

                // Check event
                response.on('data', (data) => {
                    // Get JSON object from API for city
                    const weatherData = JSON.parse(data);

                    // Only output message if valid city was entered
                    if (!weatherData.message) {
                        // get specific data
                        const temp = weatherData.main.temp;
                        const weatherDescription = weatherData.weather[0].description;

                        message.channel.send(`The temperature in ${query} is ${temp} degrees Celcius. The weather is currently ${weatherDescription}.`);
                    } else {
                        message.reply("Please enter a valid city name!");
                    }
                });

            });
        }
    }
});

// Login method to bring our bot online
client.login(process.env.DISCORDJS_BOT_TOKEN);

