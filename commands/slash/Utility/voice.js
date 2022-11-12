const Discord = require('discord.js')
const { parse, stringify } = require('lossless-json')
const ascii = require("ascii-table")

const functions = require("../../../utils/functions")
module.exports = {
    name: "voice",
    description: "Voice feature commands",
    ownerOnly: false,
    voterOnly: true,
    inVoice: true,
    BotPerms: ["ViewChannel", "ManageChannels", "MoveMembers"],
    options: [
        {
            name: "lock",
            description: "Lock your personal voice",
            type: Discord.ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "unlock",
            description: "Unlock your personal voice",
            type: Discord.ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "claim",
            description: "Claim curent personal voice",
            type: Discord.ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "config",
            description: "Cài đặt auto voice",
            type: Discord.ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: "enable",
                    description: "Bật chế độ kênh thoại tự động",
                    type: Discord.ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: "disable",
                    description: "Tắt chế độ kênh thoại tự động",
                    type: Discord.ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: "add",
                    description: "Thêm kênh thoại",
                    type: Discord.ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: "view",
                    description: "Xem các kênh thoại đã thêm",
                    type: Discord.ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: "remove",
                    description: "Xóa kênh thoại",
                    type: Discord.ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: "reset",
                    description: "Bỏ các kênh thoại đã thêm",
                    type: Discord.ApplicationCommandOptionType.Subcommand,
                },
            ],
            defaultMemberPermissions: Discord.PermissionFlagsBits.ManageGuild
        }
    ],
    run: async (client, interaction) => {
        const groupName = interaction.options._group
        const subCommand = interaction.options.getSubcommand()
        const everyone = await interaction.guild.roles.cache.find((role) => role.name === "@everyone")
        const user = await interaction.guild.members.fetch(interaction.member.id)
        if (groupName == 'config') {
            if (!functions.checkperms({ user : user, permission: 'ManageGuild' })) return interaction.reply({content : `> \`❌\` Bạn không có quyền để sử dụng lệnh này!`, ephemeral : true})
            client.mysql.query(`SELECT * FROM AUTOVOICE_CONFIG WHERE guild_id=${interaction.guild.id}`, async (err, res) => {
                if (subCommand == 'enable') {
                    if (res[0]) {
                        client.mysql.query(`UPDATE AUTOVOICE_CONFIG SET isEnabled="true" WHERE guild_id=${interaction.guild.id}`)
                    } else {
                        client.mysql.query(`INSERT INTO AUTOVOICE_CONFIG(guild_id, isEnabled, hubs) VALUES (${interaction.guild.id}, 'true', '[]')`)
                    }
                    return interaction.reply({
                        content: `> \`✅\` Thực thi thành công!`
                    })
                } else if (subCommand == 'disable') {
                    client.mysql.query(`UPDATE ROLE_AUTO SET isEnabled="false" WHERE guild_id=${interaction.guild.id}`)
                    return interaction.reply({
                        content: `> \`✅\` Thực thi thành công!`
                    })
                } else if (subCommand == 'add') {
                    if (!res[0]) return interaction.reply({
                        content: `> \`❌\` Vui lòng bật module \`auto voice\` để sử dụng lệnh này!`,
                        ephemeral : true
                    })
                    const hubs = parse(res[0].hubs)

                    hubs.push(interaction.member.voice.channel.id)
                    client.mysql.query(`UPDATE AUTOVOICE_CONFIG SET hubs="[${hubs.toString()}]" WHERE guild_id=${interaction.guild.id}`)
                    return interaction.reply({
                        content: `> \`✅\` Thực thi thành công! Đã thêm kênh <#${interaction.member.voice.channel.id}>`,
                        allowedMentions: { parse: [] }
                    })
                } else if (subCommand == 'view') {
                    if (!res[0]) return interaction.reply({
                        content: `> \`❌\` Vui lòng bật module \`auto voice\` để sử dụng lệnh này!`,
                        ephemeral : true
                    })
                    let table = new ascii(`Hubs`);
                    table.setHeading("Name");
                    const hubs = parse(res[0].hubs)
                    await hubs.forEach(async (hubShow) => {
                        const r = await interaction.guild.channels.cache.get(hubShow.value)
                        if (!r) return;
                        table.addRow(`${r.name}`)
                    })
                    return interaction.reply({
                        content : `\`\`\`${table.toString()}\`\`\``, 
                        ephemeral : false
                    })
                } else if (subCommand == 'remove') {
                    if (!res[0]) return interaction.reply({
                        content: `> \`❌\` Vui lòng bật module \`auto voice\` để sử dụng lệnh này!`,
                        ephemeral : true
                    })
                    const hubs = parse(res[0].hubs)

                    function removeElement(array, elem) {
                        var index = array.indexOf(elem);
                        if (index > -1) {
                            array.splice(index, 1);
                        }
                    }
                    await removeElement(hubs, interaction.member.voice.channel.id);
                    client.mysql.query(`UPDATE AUTOVOICE_CONFIG SET roles="[${roles.toString()}]" WHERE guild_id=${interaction.guild.id}`)
                    return interaction.reply({
                        content: `> \`✅\` Thực thi thành công! Đã xóa kênh <#${interaction.member.voice.channel.id}>`,
                        allowedMentions: { parse: [] }
                    })
                } else if (subCommand == 'reset') {
                    client.mysql.query(`DELETE FROM AUTOVOICE_CONFIG WHERE guild_id=${interaction.guild.id}`)
                    return interaction.reply({
                        content: `> \`✅\` Thực thi thành công!`,
                        allowedMentions: { parse: [] }
                    })
                }
            })
        } else {
            client.mysql.query(`SELECT * FROM TEMP_VOICE WHERE voice_id=${user.voice.channel.id}`, async (err, res) => {
                if (!res[0]) return interaction.reply({ content: `> \`❌\` Đây không phải là kênh voice cá nhân!`, ephemeral: true })
                if (subCommand == 'lock') {
                    if (res[0].owner_id !== user.id) return interaction.reply({ content: `> \`❌\` Bạn không phải chủ sở hữu kênh này!`, ephemeral: true })
                    await user.voice.channel.permissionOverwrites.edit(everyone, {
                        ViewChannel: true,
                        Connect: false,
                        Speak: false,
                        SendMessages: false,
                        ReadMessageHistory: false,
                    })
                    return interaction.reply({ content: `> \`✅\` Đã khóa kênh!`, ephemeral: true })
                } else if (subCommand == 'unlock') {
                    if (res[0].owner_id !== user.id) return interaction.reply({ content: `> \`❌\` Bạn không phải chủ sở hữu kênh này!`, ephemeral: true })
                    await user.voice.channel.permissionOverwrites.edit(everyone, {
                        ViewChannel: true,
                        Connect: true,
                        Speak: true,
                        SendMessages: true,
                        ReadMessageHistory: true,
                    })
                    return interaction.reply({ content: `> \`✅\` Đã mở khóa kênh!`, ephemeral: true })
                } else if (subCommand == 'claim') {
                    const oldOwner = await interaction.guild.members.fetch(res[0].owner_id)
                    const checkNowOwner = await user.voice.channel.members.get(oldOwner.user.id)
                    if (checkNowOwner.id == interaction.member.id) return interaction.reply({ content: `> \`🤣\` Bạn đã là chủ kênh này rồi, nhớ chưa :)))`, ephemeral: true })
                    if (checkNowOwner) return interaction.reply({ content: `> \`❌\` Chủ sở hữu hiện tại chưa rời kênh!`, ephemeral: true })
                    await user.voice.channel.permissionOverwrites.edit(user.user, {
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
                    if (oldOwner) {
                        await user.voice.channel.permissionOverwrites.delete(oldOwner.user)
                    }
                    await client.mysql.query(`UPDATE TEMP_VOICE SET owner_id=${user.user.id} WHERE voice_id=${user.voice.channel.id}`)
                    return interaction.reply({ content: `> \`✅\` Now, you are new owner of ${user.voice.channel}`, ephemeral: true })
                }

            })
        }
    }
}