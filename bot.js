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
    startMmr: "startmmr",
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

    if (messageContent.startsWith(commands.startMmr)) {
        replyToStartMmr(msg);
    }
});

replyWinLoss = (msg) => {
    msg.reply(`Wins: ${wins}, Losses: ${losses}`)
}

var mmr = 0;
var replyId = 0;

replyToStartMmr = (msg) => {
    content = msg.content.slice(commands.startMmr.length + prefix.length);
    startingValue = parseInt(content);

    if (isNaN(startingValue)) {
        console.log('invalid starting mmr:', content)
        msg.reply('Not a valid mmr to start on');
        return;
    }

    mmr = startingValue;
    msg.reply(`MMR: ${mmr}, Gap: ${mmr}`)
        .then((reply) => {
            replyId = reply.id;
            console.log('setting reply id:', replyId)
        });
}

client.login(process.env.DISCORD_TOKEN);