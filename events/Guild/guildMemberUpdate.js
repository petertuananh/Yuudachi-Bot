const client = require('../../index.js');
const Discord = require("discord.js")
client.on('guildMemberUpdate', async (oldMember, newMember) => {
    if (!oldMember || !newMember) return;
    client.mysql.query(`SELECT * FROM MODULE_LOGS WHERE guild_id=${oldMember.guild.id}`, async (err, res) => {
        if (!res[0]) return;
        if (!oldMember || (res[0].isEnabled !== 'true')) return;
        const webhook = new Discord.WebhookClient({
            id: res[0].member_id,
            token: res[0].member_token
        })
        if (oldMember.nickname !== newMember.nickname) {
            webhook.send({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor("Aqua")
                        .setAuthor({ name: 'Người dùng thay đổi biệt danh' })
                        .setFooter({ text: oldMember.user.tag, iconURL: oldMember.displayAvatarURL({ extension: 'png', size: 4096 }) })
                        .setDescription(`> ${oldMember.user} [\`${oldMember.user.id}\`]\n> \`${oldMember.nickname || oldMember.user.username}\` => \`${newMember.nickname || newMember.user.username}\``)
                        .setTimestamp()
                ]
            }).catch(e => { })
        } else if (oldMember.user.tag !== newMember.user.tag) {
            webhook.send({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor("Aqua")
                        .setAuthor({ name: 'Người dùng thay đổi tag' })
                        .setFooter({ text: oldMember.user.tag, iconURL: oldMember.displayAvatarURL({ extension: 'png', size: 4096 }) })
                        .setDescription(`> ${oldMember.user} [\`${oldMember.user.id}\`]\n> \`${oldMember.user.tag}\` => \`${newMember.user.tag}\``)
                        .setTimestamp()
                ]
            }).catch(e => { })
        } else if (oldMember.user.avatar !== newMember.user.avatar) {
            webhook.send({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor("Aqua")
                        .setAuthor({ name: 'Người dùng thay đổi ảnh đại diện' })
                        .setFooter({ text: oldMember.user.tag, iconURL: oldMember.displayAvatarURL({ extension: 'png', size: 4096 }) })
                        .setDescription(`> ${oldMember.user} [\`${oldMember.user.id}\`]\n> [Cũ](${oldMember.user.displayAvatarURL({ extension: 'png', size: 4096 })} => [Mới](${newMember.user.displayAvatarURL({ extension: 'png', size: 4096 })}))`)
                        .setThumbnail(newMember.user.displayAvatarURL({ extension: 'png', size: 4096 }))
                        .setTimestamp()
                ]
            }).catch(e => { })
        } else if (oldMember.avatar !== newMember.avatar) {
            webhook.send({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor("Aqua")
                        .setAuthor({ name: 'Người dùng thay đổi ảnh đại diện máy chủ' })
                        .setFooter({ text: oldMember.user.tag, iconURL: oldMember.displayAvatarURL({ extension: 'png', size: 4096 }) })
                        .setDescription(`> ${oldMember.user} [\`${oldMember.user.id}\`]\n> [Cũ](${oldMember.displayAvatarURL({ extension: 'png', size: 4096 })}) => [Mới](${newMember.displayAvatarURL({ extension: 'png', size: 4096 })})`)
                        .setThumbnail(newMember.displayAvatarURL({ extension: 'png', size: 4096 }))
                        .setTimestamp()
                ]
            }).catch(e => { })
        } else if (oldMember.roles !== newMember.roles) {
            client.mysql.query(`SELECT * FROM MODULE_LOGS WHERE guild_id=${oldMember.guild.id}`, async (err, res) => {
                if (!res[0]) return;
                if (!oldMember || (res[0].isEnabled !== 'true')) return;
                const webhook = new Discord.WebhookClient({
                    id: res[0].role_id,
                    token: res[0].role_token
                })
                const AuditLogFetch = await oldMember.guild.fetchAuditLogs({ limit: 1, type: 25 });
                if (!AuditLogFetch.entries.first()) return
                AuditLogFetch.entries.forEach(async (Entry) => {
                    if (oldMember.user.id !== Entry.target.id) return;
                    const roleAdd = Entry.changes[0].new.map(x => `+ ${x.name}`).join("\n")
                    const roleRemove = Entry.changes[0].new.map(x => `- ${x.name}`).join("\n")
                    const embed = new Discord.EmbedBuilder()
                        .setColor("Aqua")
                        .setAuthor({ name: 'Đã cập nhật vai trò cho thành viên' })
                        .setFooter({ text: oldMember.user.tag, iconURL: oldMember.displayAvatarURL({ extension: 'png', size: 4096 }) })
                        .setTimestamp()
                    if (Entry.changes[0].key == '$add') embed.addFields(
                        {
                            name: '> Thêm',
                            value: `\`\`\`${roleAdd}\`\`\``,
                        },
                    )
                    if (Entry.changes[0].key == '$remove') embed.addFields(
                        {
                            name: '> Xóa',
                            value: `\`\`\`${roleRemove}\`\`\``
                        }
                    )

                    webhook.send({
                        embeds: [embed]
                    }).catch(e => { })
                })
            })
        } else {
            return;
        }

    })
})