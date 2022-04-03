// Run dotenv
require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })

var mmr = 0;
const targetMmr = 1760;
var replyId = 0;
// hard coded to general in my test server for now
var channelId = process.env.CHANNELID;

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    var channel = await client.channels.fetch(channelId);
    var pinnedMessages = await channel.messages.fetchPinned();
    pinnedMessages.forEach(msg => {
        var lowerCaseMsg = msg.content.toLowerCase();
        if (lowerCaseMsg.includes("mmr")) {
            try {
                mmr = parseInt(lowerCaseMsg.substring(lowerCaseMsg.indexOf(":") + 2, lowerCaseMsg.indexOf(",")));
            } catch (error) {
                console.error(error);
            }
            replyId = msg.id
            return;
        }
    });
});



const prefix = "!";

var wins = 0;
var losses = 0;

const commands = {
    ping: "ping",
    partyW: "partyw",
    partyL: "partyl",
    w: "w",
    l: "l",
    startMmr: "startmmr",
    update: "update",
}

client.on('message', msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    const messageContent = msg.content.slice(prefix.length).toLowerCase();


    if (messageContent === commands.ping) {
        msg.reply('pong');
    }

    if (messageContent === commands.partyW) {
        wins++;
        mmr += 20;
        replyWinLoss(msg);
    }

    if (messageContent === commands.partyL) {
        losses++;
        mmr -= 20;
        replyWinLoss(msg);
    }

    if (messageContent === commands.w) {
        wins++;
        mmr += 30;
        replyWinLoss(msg);
    }

    if (messageContent === commands.l) {
        losses++;
        mmr -= 30;
        replyWinLoss(msg);
    }


    if (messageContent.startsWith(commands.startMmr)) {
        replyToStartMmr(msg);
    }

    if (messageContent === commands.update) {
        msg.reply(formatMmr())
    }
});

replyWinLoss = async (msg) => {
    channel = client.channels.cache.get(channelId)
    message = channel.messages.fetch(replyId)
        .then(editMsg => editMsg.edit(formatMmr()))
}



replyToStartMmr = (msg) => {
    content = msg.content.slice(commands.startMmr.length + prefix.length);
    startingValue = parseInt(content);

    if (isNaN(startingValue)) {
        console.log('invalid starting mmr:', content)
        msg.reply('Not a valid mmr to start on');
        return;
    }

    mmr = startingValue;
    msg.reply(formatMmr())
        .then((reply) => {
            replyId = reply.id;
            console.log('setting reply id:', replyId)
            reply.pin();
        });
}

formatMmr = () => `MMR: ${mmr}, Gap: ${targetMmr - mmr}`;

client.login(process.env.DISCORD_TOKEN);