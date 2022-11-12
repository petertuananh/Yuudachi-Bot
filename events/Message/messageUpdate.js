const client = require('../../index.js');
const Discord = require("discord.js")
client.on("messageUpdate", async (oldMessage, newMessage) => {
    if (!oldMessage || !newMessage) return;
    if (!newMessage.member || !newMessage.author) return;
    if (newMessage.member.user.bot) return
    client.mysql.query(`SELECT * FROM MODULE_LOGS WHERE guild_id=${oldMessage.guild.id}`, async (err, res) => {
        if (!res[0]) return;
        if (!oldMessage || (res[0].isEnabled !== 'true')) return;
        const webhook = new Discord.WebhookClient({
            id: res[0].message_id,
            token: res[0].message_token
        })
        webhook.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor("Aqua")
                    .setAuthor({name : 'Tin nhắn đã chỉnh sửa'})
                    .setDescription(`> ${newMessage.member} đã chỉnh sửa [tin nhắn](${oldMessage.url}) trong ${oldMessage.channel}\n> Cũ: ${oldMessage.content}\n> Mới: ${newMessage.content}`)
                    .setTimestamp()
            ]
        }).catch(e=>{})
    })
})