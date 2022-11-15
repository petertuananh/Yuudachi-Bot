const client = require('../../index.js');
const Discord = require("discord.js")
client.on('guildMemberRemove', async (member) => {
    client.mysql.query(`SELECT * FROM MODULE_LOGS WHERE guild_id=${member.guild.id}`, async (err, res) => {
        if (!res[0]) return;
        if (!member || (res[0].isEnabled !== 'true')) return;
        const webhook = new Discord.WebhookClient({
            id: res[0].punish_id,
            token: res[0].punish_token
        })
        const AuditLogFetch = await member.guild.fetchAuditLogs({ limit: 1, type: 20 });
        if (!AuditLogFetch.entries.first()) return
        const Entry = AuditLogFetch.entries.first()
        if (Entry.target.id !== member.user.id) return;
        webhook.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor("Aqua")
                    .setAuthor({name : 'Đã kick một người dùng'})
                    .setDescription(`> \`${member.user.tag}\` [\`${member.user.id}\`] ${member.reason ? `\n> Vì: ${member.reason}` : ``}`)
                    .setThumbnail(member.user.displayAvatarURL({extension : 'png', size : 4096}))
                    .setTimestamp()
            ]
        }).catch(e=>{})
    })
    client.mysql.query(`SELECT * FROM MODULE_SERVERSTATS WHERE guild_id=${member.guild.id}`, async (err, res) => {
        if (!res[0]) return;
        if (res[0].isEnabled !== 'true') return;
        const channel_member = await member.guild.channels.cache.get(res[0].member_id) || null
        const channel_bot = await member.guild.channels.cache.get(res[0].bot_id) || null
        const channel_total = await member.guild.channels.cache.get(res[0].total_id) || null

        const members = await member.guild.members.fetch({ force: true })
        const botCount = members.filter(m => m.user.bot).size
        const data = {
            member: parseInt(members.size) - parseInt(botCount),
            bot: botCount,
            total: members.size
        }
        channel_member?.setName(`${res[0].member_text} ${data.member}`).catch(() => {return})
        channel_bot?.setName(`${res[0].bot_text} ${data.bot}`).catch(() => {return})
        channel_total?.setName(`${res[0].total_text} ${data.total}`).catch(() => {return})
    })
})