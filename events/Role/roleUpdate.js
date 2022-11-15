const client = require('../../index.js');
const Discord = require("discord.js")
const bitfieldCalculator = require("discord-bitfield-calculator")
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
                        .setAuthor({ name: 'Đã thay đổi tên vai trò' })
                        .setFooter({ text: newRole.name })
                        .setDescription(`> ${oldRole} [\`${oldRole.id}\`]\n> \`${oldRole.name}\` => \`${newRole.name}\``)
                        .setTimestamp()
                ]
            }).catch(e => { })
        } else if (oldRole.color !== newRole.color) {
            webhook.send({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor("Aqua")
                        .setAuthor({ name: 'Đã thay đổi màu vai trò' })
                        .setFooter({ text: newRole.name })
                        .setDescription(`> ${oldRole} [\`${oldRole.id}\`]\n> \`${oldRole.hexColor}\` => \`${newRole.hexColor}\``)
                        .setTimestamp()
                ]
            }).catch(e => { })
        } else if (oldRole.hoist !== newRole.hoist) {
            webhook.send({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor("Aqua")
                        .setAuthor({ name: 'Đã thay đổi hiển thị vai trò' })
                        .setFooter({ text: newRole.name })
                        .setDescription(`> ${oldRole} [\`${oldRole.id}\`]\n> \`${oldRole.hoist ? `Hiện` : `Ẩn`}\` => \`${oldRole.hoist ? `Ẩn` : `Hiện`}\``)
                        .setTimestamp()
                ]
            }).catch(e => { })
        } else if (oldRole.mentionable !== newRole.mentionable) {
            webhook.send({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor("Aqua")
                        .setAuthor({ name: 'Đã thay đổi quyền đề cập vai trò' })
                        .setFooter({ text: newRole.name })
                        .setDescription(`> ${oldRole} [\`${oldRole.id}\`]\n> \`${oldRole.mentionable ? `Có` : `Không`}\` => \`${oldRole.mentionable ? `Không` : `Có`}\``)
                        .setTimestamp()
                ]
            }).catch(e => { })
        } else if (oldRole.icon !== newRole.icon) {
            webhook.send({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor("Aqua")
                        .setAuthor({ name: 'Đã thay đổi biểu tượng vai trò' })
                        .setFooter({ text: newRole.name })
                        .setDescription(`> ${oldRole} [\`${oldRole.id}\`]\n> ${oldRole.icon ? `[Cũ](${oldRole.iconURL({ extension: 'png', size: 4096 })})` : `Không`} => ${newRole.icon ? `[Mới](${newRole.iconURL({ extension: 'png', size: 4096 })})` : `Không`}`)
                        .setTimestamp()
                ]
            }).catch(e => { })
        } else if (oldRole.position !== newRole.position) {
            webhook.send({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor("Aqua")
                        .setAuthor({ name: 'Đã thay đổi vị trí vai trò' })
                        .setFooter({ text: newRole.name })
                        .setDescription(`> ${oldRole} [\`${oldRole.id}\`]\n> \`${oldRole.position}\` => \`${newRole.position}\``)
                        .setTimestamp()
                ]
            }).catch(e => { })
        } else if (oldRole.permissions !== newRole.permissions) {
            const AuditLogFetch = await oldRole.guild.fetchAuditLogs({ limit: 1, type: 31 });
            if (!AuditLogFetch.entries.first()) return
            AuditLogFetch.entries.forEach(async (Entry) => {
                const permAdd = bitfieldCalculator.permissions(parseInt(newRole.permissions.bitfield) - parseInt(oldRole.permissions.bitfield)).map(x => `+ ${x}`).join("\n")
                const permRemove = bitfieldCalculator.permissions(parseInt(oldRole.permissions.bitfield) - parseInt(newRole.permissions.bitfield)).map(x => `- ${x}`).join("\n")
                const embed = new Discord.EmbedBuilder()
                    .setColor("Aqua")
                    .setAuthor({ name: 'Đã thay đổi quyền hạn vai trò' })
                    .setFooter({ text: newRole.name })
                    .setDescription(`> ${oldRole} [\`${oldRole.id}\`]`)
                    .setTimestamp()
                if (newRole.permissions.bitfield > oldRole.permissions.bitfield) embed.addFields(
                    {
                        name: '> Gán',
                        value: `\`\`\`${permAdd}\`\`\``,
                    },
                )
                if (oldRole.permissions.bitfield > newRole.permissions.bitfield) embed.addFields(
                    {
                        name: '> Từ chối',
                        value: `\`\`\`${permRemove}\`\`\``
                    }
                )
                webhook.send({
                    embeds: [embed]
                }).catch(e => { })
            })
        }
    })
})