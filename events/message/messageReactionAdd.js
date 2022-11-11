const client = require('../../index');
const crypto = require("crypto")
client.on('messageReactionAdd', async (reaction, user, guild) => {
    const emoji = !reaction.emoji.id ? reaction.emoji.name : reaction.emoji.animated ? `<a:${reaction.emoji.name}:${reaction.emoji.id}>` : `<:${reaction.emoji.name}:${reaction.emoji.id}>`
    const emoji2 = crypto.createHash('sha256').update(emoji).digest('hex')
    client.mysql.query(`SELECT * FROM MODULE_REACTROLE WHERE message_id=${reaction.message.id} && emoji="${emoji2}"`, async function(err, res) {
        if (!res[0]) return
        try {
            reaction.message.guild.members.cache.get(user.id).roles.add(res[0].role_id, `[REACTION ROLE]`)
        } catch (error) {
            return
        }
    })
})