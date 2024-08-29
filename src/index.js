const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] 
});
require('dotenv').config();

const prefix = "k";

const badWords = ["Darth Vader", "Bart Simpson", "Donald Trump", "Barack Obama"];

client.on("ready", () => {
    console.log("Bot is online");
    client.user.setActivity(`I am Alive`, { type: "READING" });
})

client.on("messageCreate", (message) => {
    if (!message.content.startsWith(prefix)) {
        return;
    }

    const user = message.author;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    let amount = parseInt(args[0]);

    function deleteFewMessages() {
        return message.channel.bulkDelete(2)
            .catch(err => console.error(err));
    }

    function deleteSelectedMessages() {
        return message.channel.bulkDelete(amount + 2)
            .catch(err => console.error(err));
    }

    for (let i = 0; i < badWords.length; i++) {
        if (message.content.includes(badWords[i])) {
            message.channel.send("PREPARE TO GET BANISHED TO THE SHADOW REALM")
                .then(() => setTimeout(deleteFewMessages, 5000));
            return;
        }
    }

    if (command === "ill") {
        if (isNaN(amount)) {
            console.log("No messages have been deleted. No number specified.");
            message.channel.send(`<@${user.id}>: No messages have been deleted as no number has been specified`)
                .then(() => setTimeout(deleteFewMessages, 5000));
        }
        else if (amount < 1 || amount > 100) {
            console.log(`${user.username}: Too many messages selected. ${amount}`);
            message.channel.send(`<@${user.id}> I cannot delete that many messages. Please set a number between **1 - 11**`)
                .then(() => setTimeout(deleteFewMessages, 5000));
        }
        else {
            console.log(`${user.username}: Messages deleted: ${amount}`);
            message.channel.send(`<@${user.id}> Amount of messages that are going to be deleted: **${amount}**\nStandby for deletion...`)
                .then(() => setTimeout(deleteSelectedMessages, 5000));
        }
    }
});

client.login(process.env.TOKEN);