const client = require('../../index.js');
const Discord = require('discord.js');
client.on('voiceStateUpdate', async (oldState, newState) => {
    if (newState.channel) {
        if (!client.config.setting.channels.tempvoices.includes(newState.channel.id)) return
        if (!newState.member) return
        if (newState.member.user.bot) return
        if (!newState.member) return
        if (newState.member.user.bot) return
        const userVoice = await newState.channel.clone()
        await userVoice.setName(`${newState.member.user.username}`)
        await userVoice.permissionOverwrites.edit(newState.member, {
            ViewChannel : true,
            SendMessages : true,
            ReadMessageHistory : true,
            Connect : true,
            Speak : true,
            MuteMembers : true,
            DeafenMembers : true,
            MoveMembers : true,
            ManageChannels : true,
            ManageRoles : true,
        })
        await client.mysql.query(`INSERT INTO TEMP_VOICE(voice_id, owner_id, createAt) VALUES (${userVoice.id}, ${newState.member.id}, ${Date.now()})`) 
        return newState.member.voice.setChannel(userVoice).catch(() => {
            userVoice.delete()
        })
    } else if (oldState.channel) {
        if (oldState.channel.members.size > 0) {
            return;
        } else {
            setTimeout(() => {
                if (!oldState.channel) return
                if (!(oldState.channel.members.size > 0)) {
                    client.mysql.query(`SELECT * FROM TEMP_VOICE WHERE voice_id=${oldState.channel.id}`, async (err, res) => {
                        if (!res[0]) return;
                        await client.mysql.query(`DELETE FROM TEMP_VOICE WHERE (voice_id)=${oldState.channel.id}`)
                        return oldState.channel.delete()
                    })
                }
            }, 5000)
        }
    }
})