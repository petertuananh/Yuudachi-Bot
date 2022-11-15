const client = require('../../index.js');
const Discord = require('discord.js');
const { parse, stringify } = require('lossless-json')

client.on('voiceStateUpdate', async (oldState, newState) => {
    if (!oldState.streaming && newState.streaming) {
        client.mysql.query(`SELECT * FROM ROLE_AUTO WHERE guild_id=${newState.guild.id} && type='streaming'`, async (err, res) => {
            if (!res[0]) return;
            if (res[0].isEnabled !== 'true') return;
            const roles = parse(res[0].roles)
            roles.forEach(role => {
                newState.member.roles.add(role.value, `[AUTO STREAMING ROLE]`).catch(() => { return })
            })
        })
    }
    if (oldState.streaming && !newState.streaming) {
        client.mysql.query(`SELECT * FROM ROLE_AUTO WHERE guild_id=${newState.guild.id} && type='streaming'`, async (err, res) => {
            if (!res[0]) return;
            if (res[0].isEnabled !== 'true') return;
            const roles = parse(res[0].roles)
            roles.forEach(role => {
                newState.member.roles.remove(role.value, `[AUTO STREAMING ROLE]`).catch(() => { return })
            })
        })
    }
    if ((oldState.channel && newState.channel) && (oldState.channel !== newState.channel)) {
        client.mysql.query(`SELECT * FROM MODULE_LOGS WHERE guild_id=${oldState.guild.id}`, async (err, res) => {
            if (!res[0]) return;
            if (!oldState.channel || (res[0].isEnabled !== 'true')) return;
            const webhook = new Discord.WebhookClient({
                id: res[0].voice_id,
                token: res[0].voice_token
            })
            webhook.send({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor("Aqua")
                        .setAuthor({ name: 'Một thành viên đã di chuyển kênh' })
                        .setFooter({ text: oldState.member.user.tag, iconURL: oldState.member.user.displayAvatarURL({ extension: 'png', size: 4096 }) })
                        .setDescription(`> ${oldState.member} [\`${oldState.member.id}\`]\n> ${oldState.channel} => ${newState.channel}`)
                        .setTimestamp()
                ]
            }).catch(e => { })
        })
    }
    if (newState.channel) {
        const check =
            (oldState.serverDeaf && newState.serverDeaf) &&
            (!oldState.serverDeaf && !newState.serverDeaf) &&
            (oldState.serverMute && newState.serverMute) &&
            (!oldState.serverMute && !newState.serverMute) &&
            (oldState.selfDeaf && newState.selfDeaf) &&
            (!oldState.selfDeaf && !newState.selfDeaf) &&
            (oldState.selfMute && newState.selfMute) &&
            (!oldState.selfMute && !newState.selfMute) &&
            (oldState.selfVideo && newState.selfVideo) &&
            (!oldState.selfVideo && !newState.selfVideo) &&
            (oldState.mute && newState.mute) &&
            (!oldState.mute && !newState.mute) &&
            // (oldState.suppress && newState.suppress) &&
            // (!oldState.suppress && !newState.suppress) &&
            (oldState.streaming && newState.streaming) &&
            (!oldState.streaming && !newState.streaming)
        if (!check) {
            client.mysql.query(`SELECT * FROM MODULE_LOGS WHERE guild_id=${oldState.guild.id}`, async (err, res) => {
                if (!res[0]) return;
                if (!newState.channel || (res[0].isEnabled !== 'true')) return;
                const webhook = new Discord.WebhookClient({
                    id: res[0].voice_id,
                    token: res[0].voice_token
                })
                webhook.send({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setColor("Aqua")
                            .setAuthor({ name: 'Một thành viên đã tham gia kênh' })
                            .setFooter({ text: oldState.member.user.tag, iconURL: oldState.member.user.displayAvatarURL({ extension: 'png', size: 4096 }) })
                            .setDescription(`> ${oldState.member} tham gia ${newState.channel}`)
                            .setTimestamp()
                    ]
                }).catch(e => { })
            })
        }
        client.mysql.query(`SELECT * FROM AUTOVOICE_CONFIG WHERE guild_id=${newState.guild.id}`, async (err, res) => {
            if (!res[0]) return
            if (res[0].isEnabled !== 'true') return;
            const hubs = parse(res[0].hubs)
            hubs.forEach(async hub => {
                if (hub.value !== newState.channel.id) return
                if (!newState.member) return
                if (newState.member.user.bot) return
                if (!newState.member) return
                const userVoice = await newState.channel.clone()
                await userVoice.setName(`${newState.member.user.username}`)
                await userVoice.permissionOverwrites.edit(newState.member, {
                    ViewChannel: true,
                    SendMessages: true,
                    ReadMessageHistory: true,
                    Connect: true,
                    Speak: true,
                    MuteMembers: true,
                    DeafenMembers: true,
                    MoveMembers: true,
                    ManageChannels: true,
                    ManageRoles: true,
                })
                await client.mysql.query(`INSERT INTO TEMP_VOICE(voice_id, owner_id, createAt) VALUES (${userVoice.id}, ${newState.member.id}, ${Date.now()})`)
                return newState.member.voice.setChannel(userVoice).catch(() => {
                    userVoice.delete()
                })
            })
        })
    } else if (oldState.channel) {
        client.mysql.query(`SELECT * FROM MODULE_LOGS WHERE guild_id=${oldState.guild.id}`, async (err, res) => {
            if (!res[0]) return;
            if (!oldState.channel || (res[0].isEnabled !== 'true')) return;
            const webhook = new Discord.WebhookClient({
                id: res[0].voice_id,
                token: res[0].voice_token
            })
            webhook.send({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor("Aqua")
                        .setAuthor({ name: 'Một thành viên đã rời kênh' })
                        .setFooter({ text: oldState.member.user.tag, iconURL: oldState.member.user.displayAvatarURL({ extension: 'png', size: 4096 }) })
                        .setDescription(`> ${oldState.member} rời khỏi ${oldState.channel}`)
                        .setTimestamp()
                ]
            }).catch(e => { })
        })
        client.mysql.query(`SELECT * FROM ROLE_AUTO WHERE guild_id=${newState.guild.id} && type='streaming'`, async (err, res) => {
            if (!res[0]) return;
            if (res[0].isEnabled !== 'true') return;
            const roles = parse(res[0].roles)
            if (!newState.member) return;
            roles.forEach(role => {
                newState.member.roles.remove(role.value, `[AUTO STREAMING ROLE]`).catch(() => { return })
            })
        })
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