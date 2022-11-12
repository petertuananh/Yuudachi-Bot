const client = require('../../index.js');
const { parse, stringify } = require('lossless-json')
client.on('guildMemberAdd', async (member) => {
    client.mysql.query(`SELECT * FROM ROLE_AUTO WHERE guild_id=${member.guild.id} && type='join'`, async (err, res) => {
        if (!res[0]) return;
        if (res[0].isEnabled !== 'true') return;
        const roles = parse(res[0].roles)
        roles.forEach(role => {
            member.roles.add(role.value, `[AUTO JOIN ROLE]`).catch(() => {return})
        })
    })
})