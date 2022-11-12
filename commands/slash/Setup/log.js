const Discord = require('discord.js')
const ascii = require("ascii-table")
const { parse, stringify } = require('lossless-json')
module.exports = {
    name: "log",
    description: "Hệ thống nhật ký",
    ownerOnly: false,
    voterOnly: true,
    BotPerms: ["ManageGuild"],
    /**
     * @arg {Discord.Client} client
     * @arg {Discord.Interaction} interaction
     */
    options: [
        {
            name: "enable",
            description: "Bật hệ thống nhật ký",
            type: Discord.ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "disable",
            description: "Tắt hệ thống nhật ký",
            type: Discord.ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "channel",
            description: "Nhật ký về kênh",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "channel",
                    description: "Kênh",
                    type: Discord.ApplicationCommandOptionType.Channel,
                    required: true
                },
            ]
        },
        {
            name: "role",
            description: "Nhật ký về vai trò",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "channel",
                    description: "Kênh",
                    type: Discord.ApplicationCommandOptionType.Channel,
                    required: true
                },
            ]
        },
        {
            name: "punish",
            description: "Nhật ký về các thành viên bị xử lý",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "channel",
                    description: "Kênh",
                    type: Discord.ApplicationCommandOptionType.Channel,
                    required: true
                },
            ]
        },
        {
            name: "message",
            description: "Nhật ký về tin nhắn",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "channel",
                    description: "Kênh",
                    type: Discord.ApplicationCommandOptionType.Channel,
                    required: true
                },
            ]
        },
        {
            name: "member",
            description: "Nhật ký về thành viên",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "channel",
                    description: "Kênh",
                    type: Discord.ApplicationCommandOptionType.Channel,
                    required: true
                },
            ]
        },
        {
            name: "voice",
            description: "Nhật ký về kênh thoại",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "channel",
                    description: "Kênh",
                    type: Discord.ApplicationCommandOptionType.Channel,
                    required: true
                },
            ]
        }
    ],
    run: async (client, interaction) => {
        await interaction.reply({content : `> Đang gửi yêu cầu...`})
        const groupName = interaction.options._group
        const subCommand = interaction.options.getSubcommand()
        const channelInput = interaction.options.getChannel("channel") ? await interaction.options.getChannel("channel").id : null
        const channel = interaction.guild.channels.cache.get(channelInput)
        const avatar = await client.user.displayAvatarURL({ extension: 'png' })
        
        client.mysql.query(`SELECT * FROM MODULE_LOGS WHERE guild_id=${interaction.guild.id}`, async (err, res) => {
            if (subCommand == 'enable') {
                if (res[0]) {
                    client.mysql.query(`UPDATE MODULE_LOGS SET isEnabled="true" WHERE guild_id=${interaction.guild.id}`)
                } else {
                    client.mysql.query(`INSERT INTO MODULE_LOGS(guild_id, isEnabled) VALUES (${interaction.guild.id}, 'true')`)
                }
                return interaction.editReply({
                    content: `> \`✅\` Thực thi thành công!`
                })
            } else if (subCommand == 'disable') {
                client.mysql.query(`UPDATE MODULE_LOGS SET isEnabled="false" WHERE guild_id=${interaction.guild.id}`)
                return interaction.editReply({
                    content: `> \`✅\` Thực thi thành công!`
                })
            } else {
                const webhook = await channel.createWebhook({
                    name: client.user.username,
                    avatar: avatar,
                    reason: `${client.user.username} cần một webhook để gửi nhật ký`
                })
                if (subCommand == 'channel') {
                    client.mysql.query(`UPDATE MODULE_LOGS SET channel_id=${webhook.id}, channel_token="${webhook.token}" WHERE guild_id=${interaction.guild.id}`)
                    return interaction.editReply({
                        content: `> \`✅\` Thực thi thành công!`
                    })
                } else if (subCommand == 'role') {
                    client.mysql.query(`UPDATE MODULE_LOGS SET role_id=${webhook.id}, role_token="${webhook.token}" WHERE guild_id=${interaction.guild.id}`)
                    return interaction.editReply({
                        content: `> \`✅\` Thực thi thành công!`
                    })
                } else if (subCommand == 'punish') {
                    client.mysql.query(`UPDATE MODULE_LOGS SET punish_id=${webhook.id}, punish_token="${webhook.token}" WHERE guild_id=${interaction.guild.id}`)
                    return interaction.editReply({
                        content: `> \`✅\` Thực thi thành công!`
                    })
                } else if (subCommand == 'message') {
                    client.mysql.query(`UPDATE MODULE_LOGS SET message_id=${webhook.id}, message_token="${webhook.token}" WHERE guild_id=${interaction.guild.id}`)
                    return interaction.editReply({
                        content: `> \`✅\` Thực thi thành công!`
                    })
                } else if (subCommand == 'member') {
                    client.mysql.query(`UPDATE MODULE_LOGS SET member_id=${webhook.id}, member_token="${webhook.token}" WHERE guild_id=${interaction.guild.id}`)
                    return interaction.editReply({
                        content: `> \`✅\` Thực thi thành công!`
                    })
                } else if (subCommand == 'voice') {
                    client.mysql.query(`UPDATE MODULE_LOGS SET voice_id=${webhook.id}, voice_token="${webhook.token}" WHERE guild_id=${interaction.guild.id}`)
                    return interaction.editReply({
                        content: `> \`✅\` Thực thi thành công!`
                    })
                }
            }
            
        })
    }
}