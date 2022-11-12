const client = require('../../index.js');
const { parse, stringify } = require('lossless-json')
client.on('guildMemberAdd', async (member) => {
    client.mysql.query(`SELECT * FROM ROLE_AUTO WHERE guild_id=${member.guild.id} && type='join'`, async (err, res) => {
        if (!res[0]) return;
        if (res[0].isEnabled !== 'true') return;
        const roles = parse(res[0].roles)
        roles.forEach(role => {
            member.roles.add(role.value, `[AUTO JOIN ROLE]`).catch(() => { return })
        })
    })
    client.mysql.query(`SELECT * FROM MODULE_SERVERSTATS WHERE guild_id=${member.guild.id}`, async (err, res) => {
        if (!res[0]) return;
        if (res[0].isEnabled !== 'true') return;
        const channel_member = await member.guild.channels.cache.get(res[0].member_id) || null
        const channel_bot = await member.guild.channels.cache.get(res[0].bot_id) || null
        const channel_total = await member.guild.channels.cache.get(res[0].total_id) || null
        const data = {
            member: await member.guild.members.cache.filter((m) => !m.user.bot).size,
            bot: await member.guild.members.cache.filter((m) => m.user.bot).size,
            total: await member.guild.memberCount
        }
        if (channel_member) channel_member.setName(`${res[0].member_text} ${data.member.toString()}`).catch(() => {return})
        if (channel_bot) channel_bot.setName(`${res[0].bot_text} ${data.bot.toString()}`).catch(() => {return})
        if (channel_total) channel_total.setName(`${res[0].total_text} ${data.total.toString()}`).catch(() => {return})
    })
})