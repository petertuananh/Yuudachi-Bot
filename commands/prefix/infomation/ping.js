const Discord = require("discord.js");

module.exports = {
    name: "ping",
    aliases: ["p"],
    category: "Information",
    description: "Return Bot Latencies",
    cooldown: 5,
    ownerOnly : false,
    run: async (client, message, args) => {
        const msg = await message.reply(`> ・ Pinging ...`)
        const timestamp = (message.editedTimestamp) ? message.editedTimestamp : message.createdTimestamp;
        const latency = `${Math.floor(msg.createdTimestamp - timestamp)} ms`;
        const apiLatency = `${message.client.ws.ping - 19} ms`;
        return msg.edit({
            embeds : [
                new Discord.EmbedBuilder()
                .setColor("Aqua")
                .setDescription(`・Client Ping : \`${latency}\`\n・API Ping : \`${apiLatency}\``)
            ],
            content : ""
        })
    }
}