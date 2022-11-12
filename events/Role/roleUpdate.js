const client = require('../../index.js');
const Discord = require("discord.js")
client.on('roleUpdate', async (oldRole, newRole) => {
    if (!oldRole || !newRole) return;
    client.mysql.query(`SELECT * FROM MODULE_LOGS WHERE guild_id=${oldRole.guild.id}`, async (err, res) => {
        if (!res[0]) return;
        if (!oldRole || (res[0].isEnabled !== 'true')) return;
        const webhook = new Discord.WebhookClient({
            id: res[0].role_id,
            token: res[0].role_token
        })
        if (oldRole.name !== newRole.name) {
            webhook.send({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor("Aqua")
                        .setAuthor({name : 'Đã thay đổi tên vai trò'})
                        .setFooter({text : newRole.name})
                        .setDescription(`> ${oldRole} [\`${oldRole.id}\`]\n> \`${oldRole.name}\` => \`${newRole.name}\``)
                        .setTimestamp()
                ]
            }).catch(e=>{})
        }
    })
})