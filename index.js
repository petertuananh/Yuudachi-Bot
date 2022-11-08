console.clear();
const colors = require('colors');
const Discord = require("discord.js");
const db = require('quick.db');
const fs = require("fs");
const client = new Discord.Client({
    restTimeOffset: 0,
    allowedMentions: {
        parse: ["roles", "users", /*"everyone"*/ ],
        repliedUser: false,
    },
    intents: [
		Discord.GatewayIntentBits.Guilds, 
		Discord.GatewayIntentBits.GuildMessages, 
		// Discord.GatewayIntentBits.GuildPresences,
		Discord.GatewayIntentBits.GuildMessageReactions, 
		Discord.GatewayIntentBits.DirectMessages,
		Discord.GatewayIntentBits.MessageContent
	],
	partials: [
        Discord.Partials.Channel,
        Discord.Partials.Message,
        Discord.Partials.User,
        Discord.Partials.GuildMember,
        Discord.Partials.Reaction
    ],
    disableEveryone: true,
    // ws: { properties: { $browser: config.setting.presence.phone ? "Discord iOS" : "" }},
})
module.exports = client;
client.db = db;
client.config = require('./Settings/Configuration/config.js');
client.emoji = require('./Settings/Configuration/emojis.js');
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.slashcommands = new Discord.Collection();

const res = fs.readdirSync('./handlers');
res.map(name => require(`./handlers/${name}`)(client));



client.login(client.config.bot.token)