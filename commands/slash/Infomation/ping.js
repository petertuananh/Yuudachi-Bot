const Discord = require("discord.js");

module.exports = {
    name: "ping",
    description: "Return Bot Latencies",
    category: "Information",
    cooldown: 5,
    ownerOnly : false,
    run: async (client, interaction, args) => {
        const msg = await interaction.reply(`> ・ Pinging ...`)
        const timestamp = (interaction.editedTimestamp) ? interaction.editedTimestamp : interaction.createdTimestamp;
        const latency = `${Math.floor(msg.createdTimestamp - timestamp)} ms`;
        const apiLatency = `${interaction.client.ws.ping - 19} ms`;
        return interaction.editReply({
            embeds : [
                new Discord.EmbedBuilder()
                .setColor("Aqua")
                .setDescription(`・Client Ping : \`${latency}\`\n・API Ping : \`${apiLatency}\``)
            ],
            content : ""
        })
    }
}