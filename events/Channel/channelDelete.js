const client = require('../../index.js');
const Discord = require("discord.js")
client.on('channelDelete', async (channel) => {
    client.mysql.query(`SELECT * FROM MODULE_LOGS WHERE guild_id=${channel.guild.id}`, async (err, res) => {
        if (!res[0]) return;
        if (!channel || (res[0].isEnabled !== 'true')) return;
        const webhook = new Discord.WebhookClient({
            id: res[0].channel_id,
            token: res[0].channel_token
        })
        webhook.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor("Aqua")
                    .setAuthor({name : 'Đã xóa một kênh'})
                    .setFooter({text : channel.name})
                    .setDescription(`> \`${channel.name}\` [\`${channel.id}\`]`)
                    .setTimestamp()
            ]
        }).catch(e=>{})
    })
})