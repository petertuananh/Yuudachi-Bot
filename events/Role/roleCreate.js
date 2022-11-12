const client = require('../../index.js');
const Discord = require("discord.js")
client.on('roleCreate', async (role) => {
    client.mysql.query(`SELECT * FROM MODULE_LOGS WHERE guild_id=${role.guild.id}`, async (err, res) => {
        if (!res[0]) return;
        if (!role || (res[0].isEnabled !== 'true')) return;
        const webhook = new Discord.WebhookClient({
            id: res[0].role_id,
            token: res[0].role_token
        })
        webhook.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor("Aqua")
                    .setAuthor({name : 'Đã tạo một vai trò'})
                    .setFooter({text : role.name})
                    .setDescription(`> ${role} [\`${role.id}\`]`)
                    .setTimestamp()
            ]
        }).catch(e=>{})
    })
})