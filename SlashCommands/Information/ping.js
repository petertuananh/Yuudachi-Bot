const Discord = require("discord.js");

module.exports = {
    name: "ping",
    description: "Return Bot Latencies",
    category: "Information",
    cooldown: 5,
    ownerOnly : false,
    run: async (client, interaction, args) => {

        const embed = new Discord.EmbedBuilder()
            .setDescription('・Pinging...')
            .setColor(client.config.general.successID);

        const msg = await interaction.reply({
            embeds: [embed]
        });// ehe, cái handler xưa đây r :))))))
// slash à =)))
// hay e muốn prefix
// anh làm slash còn em làm prefix cũng đc, lát nữa em có thể ăn cơm đây =))) uh :>
// ok let's go, prefix ở ./Commands
        const apiLatency = `  ${interaction.client.ws.ping - 19} ms`;

        embed.setDescription(`・Ping : ${apiLatency}`)

        interaction.editReply({
            embeds: [embed]
        });
    }
}