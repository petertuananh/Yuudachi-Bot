console.clear();
const colors = require('colors');
const Discord = require("discord.js");
const db = require('quick.db');
const fs = require("fs");
const { con } = require("./utils/mysql")
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
		Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildIntegrations,
        Discord.GatewayIntentBits.GuildBans,
        // Discord.GatewayIntentBits.GuildMessages
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
client.config = require("./config.json")
client.commands = new Discord.Collection();
client.mysql = con
client.aliases = new Discord.Collection();
client.slashcommands = new Discord.Collection();

const res = fs.readdirSync('./handlers');
res.map(name => require(`./handlers/${name}`)(client));



client.login(client.config.discord.token)