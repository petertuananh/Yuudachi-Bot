const client = require('../../index.js');
const Discord = require("discord.js")
client.on('messageDelete', async (message) => {
    if (!message) return;
    if (!message.member || !message.author) return;
    client.mysql.query(`SELECT * FROM MODULE_LOGS WHERE guild_id=${message.guild.id}`, async (err, res) => {
        if (!res[0]) return;
        if (!message || (res[0].isEnabled !== 'true')) return;
        const webhook = new Discord.WebhookClient({
            id: res[0].message_id,
            token: res[0].message_token
        })
        webhook.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor("Aqua")
                    .setAuthor({name : 'Tin nhắn đã xóa'})
                    .setDescription(`> Đã xóa tin nhắn từ <@${message.member.id}> trong ${message.channel}\n> Nội dung: ${message.content}`)
                    .addFields({
                        name : `Attachments`,
                        value : `${
                            message.attachments.size
                                ? message.attachments
                                    .map((a) => `┕ [\`File: ${a.name}\`](${a.proxyURL})`)
                                    .join('\n')
                                : '┕ `No`'
                        }`,
                        inline : false
                    })
                    .setImage(
                        message.attachments.size ? message.attachments.first().proxyURL : null,
                    )
                    .setTimestamp()
            ]
        }).catch(e=>{})
    })
})