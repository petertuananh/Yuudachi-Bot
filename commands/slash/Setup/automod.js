const Discord = require('discord.js')
const ascii = require("ascii-table")
const { parse, stringify } = require('lossless-json')
module.exports = {
    name: "automod",
    description: "Chế độ quản lý tự động",
    ownerOnly: false,
    voterOnly: true,
    BotPerms: ["ManageGuild"],
    /**
     * @arg {Discord.Client} client
     * @arg {Discord.Interaction} interaction
     */
    options: [
        {
            name: "commandwrongareas",
            description: "Dùng lệnh bot sai kênh",
            type: Discord.ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: "enable",
                    description: "Bật chế độ chống dùng bot sai kênh",
                    type: Discord.ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: "disable",
                    description: "Tắt chế độ chống dùng bot sai kênh",
                    type: Discord.ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: "add",
                    description: "Thêm kênh có thể dùng lệnh bot",
                    type: Discord.ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "channel",
                            description: "kênh",
                            type: Discord.ApplicationCommandOptionType.Channel,
                            required: true,
                        },
                    ]
                },
                {
                    name: "view",
                    description: "Xem các kênh có thể dùng lệnh bot",
                    type: Discord.ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: "remove",
                    description: "Bỏ kênh có thể dùng lệnh bot",
                    type: Discord.ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "channel",
                            description: "Kênh",
                            type: Discord.ApplicationCommandOptionType.Channel,
                            required: true,
                        },
                    ]
                },
                {
                    name: "reset",
                    description: "Bỏ các kênh đã thêm",
                    type: Discord.ApplicationCommandOptionType.Subcommand,
                },
            ]
        }
    ],
    run: async (client, interaction) => {
        const groupName = interaction.options._group
        const subCommand = interaction.options.getSubcommand()
        const channel = interaction.options.getChannel("channel") ? await interaction.options.getChannel("channel").id : null
        if (groupName == 'commandwrongareas') {
            client.mysql.query(`SELECT * FROM MODULE_CMDWRONGAREA WHERE guild_id=${interaction.guild.id}`, async (err, res) => {
                if (subCommand == 'enable') {
                    if (res[0]) {
                        client.mysql.query(`UPDATE MODULE_CMDWRONGAREA SET isEnabled="true" WHERE guild_id=${interaction.guild.id}`)
                    } else {
                        client.mysql.query(`INSERT INTO MODULE_CMDWRONGAREA(guild_id, isEnabled, channels) VALUES (${interaction.guild.id}, 'true', '[]')`)
                    }
                    return interaction.reply({
                        content: `> \`✅\` Thực thi thành công!`
                    })
                } else if (subCommand == 'disable') {
                    client.mysql.query(`UPDATE MODULE_CMDWRONGAREA SET isEnabled="false" WHERE guild_id=${interaction.guild.id}`)
                    return interaction.reply({
                        content: `> \`✅\` Thực thi thành công!`
                    })
                } else if (subCommand == 'add') {
                    if (!res[0]) return interaction.reply({
                        content: `> \`❌\` Vui lòng bật module để sử dụng lệnh này!`,
                        ephemeral : true
                    })
                    const channels = parse(res[0].channels)

                    channels.push(channel)
                    client.mysql.query(`UPDATE MODULE_CMDWRONGAREA SET channels="[${channels.toString()}]" WHERE guild_id=${interaction.guild.id}`)
                    return interaction.reply({
                        content: `> \`✅\` Thực thi thành công! Đã thêm kênh <#${channel}>`,
                        allowedMentions: { parse: [] }
                    })
                } else if (subCommand == 'view') {
                    if (!res[0]) return interaction.reply({
                        content: `> \`❌\` Vui lòng bật module để sử dụng lệnh này!`,
                        ephemeral : true
                    })
                    let table = new ascii(`channels`);
                    table.setHeading("Name");
                    const channels = parse(res[0].channels)
                    await channels.forEach(async (roleShow) => {
                        const r = await interaction.guild.channels.cache.get(roleShow.value)
                        if (!r) return;
                        table.addRow(`${r.name}`)
                    })
                    return interaction.reply({
                        content : `\`\`\`${table.toString()}\`\`\``, 
                        ephemeral : false
                    })
                } else if (subCommand == 'remove') {
                    if (!res[0]) return interaction.reply({
                        content: `> \`❌\` Vui lòng bật module \`auto channel\` để sử dụng lệnh này!`,
                        ephemeral : true
                    })
                    const channels = parse(res[0].channels)

                    function removeElement(array, elem) {
                        var index = array.indexOf(elem);
                        if (index > -1) {
                            array.splice(index, 1);
                        }
                    }
                    await removeElement(channels, channel);
                    client.mysql.query(`UPDATE MODULE_CMDWRONGAREA SET channels="[${channels.toString()}]" WHERE guild_id=${interaction.guild.id}`)
                    return interaction.reply({
                        content: `> \`✅\` Thực thi thành công! Đã xóa kênh <#${channel}>`,
                        allowedMentions: { parse: [] }
                    })
                } else if (subCommand == 'reset') {
                    client.mysql.query(`DELETE FROM MODULE_CMDWRONGAREA WHERE guild_id=${interaction.guild.id}`)
                    return interaction.reply({
                        content: `> \`✅\` Thực thi thành công!`,
                        allowedMentions: { parse: [] }
                    })
                }
            })
        }
    }
}