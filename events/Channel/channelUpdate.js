const client = require('../../index.js');
const Discord = require("discord.js")
client.on('channelUpdate', async (oldChannel, newChannel) => {
    if (!oldChannel || !newChannel) return;
    client.mysql.query(`SELECT * FROM MODULE_LOGS WHERE guild_id=${oldChannel.guild.id}`, async (err, res) => {
        if (!res[0]) return;
        if (!oldChannel || (res[0].isEnabled !== 'true')) return;
        const webhook = new Discord.WebhookClient({
            id: res[0].channel_id,
            token: res[0].channel_token
        })
        if (oldChannel.name !== newChannel.name) {
            webhook.send({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor("Aqua")
                        .setAuthor({name : 'Đã thay đổi tên kênh'})
                        .setDescription(`> ${oldChannel} [\`${oldChannel.id}\`]\n> \`${oldChannel.name}\` => \`${newChannel.name}\``)
                        .setFooter({text : newChannel.name})
                        .setTimestamp()
                ]
            }).catch(e=>{})
        }
    })
})