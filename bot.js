// Run dotenv
require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const prefix = "!";

var wins = 0;
var losses = 0;

const commands = {
    ping: "ping",
    win: "win",
    loss: "loss",
    startMmr: "startMmr",
}
    
client.on('message', msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    const messageContent = msg.content.slice(prefix.length).toLowerCase();

    if (messageContent === commands.ping) {
        msg.reply('pong');
    }

    if (messageContent === commands.win) {
        wins++;
        replyWinLoss(msg);
    }

    if (messageContent === commands.loss) {
        losses++;
        replyWinLoss(msg);
    }
});

replyWinLoss = (msg) => {
    msg.reply(`Wins: ${wins}, Losses: ${losses}`)
}

client.login(process.env.DISCORD_TOKEN);