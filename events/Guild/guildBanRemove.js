const client = require('../../index.js');
const Discord = require("discord.js")
client.on('guildBanRemove', async (member) => {
    client.mysql.query(`SELECT * FROM MODULE_LOGS WHERE guild_id=${member.guild.id}`, async (err, res) => {
        if (!res[0]) return;
        if (!member || (res[0].isEnabled !== 'true')) return;
        const webhook = new Discord.WebhookClient({
            id: res[0].punish_id,
            token: res[0].punish_token
        })
        webhook.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor("Aqua")
                    .setAuthor({name : 'Đã bỏ cấm cho một người dùng'})
                    .setDescription(`> \`${member.user.tag}\` [\`${member.user.id}\`] ${member.reason ? `\n> Vì: ${member.reason}` : ``}`)
                    .setThumbnail(member.user.displayAvatarURL({extension : 'png', size : 4096}))
                    .setTimestamp()
            ]
        }).catch(e=>{})
    })
})