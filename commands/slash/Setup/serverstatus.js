const Discord = require('discord.js')
const ascii = require("ascii-table")
const { parse, stringify } = require('lossless-json')
module.exports = {
    name: "serverstats",
    description: "Các kênh hiển thị số lượng thành viên",
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
            description: "Bật hiển thị số lượng",
            type: Discord.ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "disable",
            description: "Tắt hiển thị số lượng",
            type: Discord.ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "member",
            description: "Kênh hiển thị số lượng member",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "channel",
                    description: "Kênh",
                    type: Discord.ApplicationCommandOptionType.Channel,
                    required: true,
                },
                {
                    name: "name",
                    description: "Tên kênh",
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true,
                },
            ]
        },
        {
            name: "bot",
            description: "Kênh hiển thị số lượng bot",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "channel",
                    description: "Kênh",
                    type: Discord.ApplicationCommandOptionType.Channel,
                    required: true,
                },
                {
                    name: "name",
                    description: "Tên kênh",
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true,
                },
            ]
        },
        {
            name: "all",
            description: "Kênh hiển thị số lượng tất cả người dùng",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "channel",
                    description: "Kênh",
                    type: Discord.ApplicationCommandOptionType.Channel,
                    required: true,
                },
                {
                    name: "name",
                    description: "Tên kênh",
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true,
                },
            ]
        },
    ],
    run: async (client, interaction) => {
        const groupName = interaction.options._group
        const subCommand = interaction.options.getSubcommand()
        const channel = interaction.options.getChannel("channel") ? await interaction.options.getChannel("channel").id : null
        const text = interaction.options.getString("name")
        client.mysql.query(`SELECT * FROM MODULE_SERVERSTATS WHERE guild_id=${interaction.guild.id}`, async (err, res) => {
            if (subCommand == 'enable') {
                if (res[0]) {
                    client.mysql.query(`UPDATE MODULE_SERVERSTATS SET isEnabled="true" WHERE guild_id=${interaction.guild.id}`)
                } else {
                    client.mysql.query(`INSERT INTO MODULE_SERVERSTATS(guild_id, isEnabled) VALUES (${interaction.guild.id}, 'true')`)
                }
                return interaction.reply({
                    content: `> \`✅\` Thực thi thành công!`
                })
            } else if (subCommand == 'disable') {
                client.mysql.query(`UPDATE MODULE_SERVERSTATS SET isEnabled="false" WHERE guild_id=${interaction.guild.id}`)
                return interaction.reply({
                    content: `> \`✅\` Thực thi thành công!`
                })
            } else if (subCommand == 'member') {
                client.mysql.query(`UPDATE MODULE_SERVERSTATS SET member_id=${channel}, member_text="${text}" WHERE guild_id=${interaction.guild.id}`)
                return interaction.reply({
                    content: `> \`✅\` Thực thi thành công!`
                })
            } else if (subCommand == 'bot') {
                client.mysql.query(`UPDATE MODULE_SERVERSTATS SET bot_id=${channel}, bot_text="${text}" WHERE guild_id=${interaction.guild.id}`)
                return interaction.reply({
                    content: `> \`✅\` Thực thi thành công!`
                })
            } else if (subCommand == 'all') {
                client.mysql.query(`UPDATE MODULE_SERVERSTATS SET total_id=${channel}, total_text="${text}" WHERE guild_id=${interaction.guild.id}`)
                return interaction.reply({
                    content: `> \`✅\` Thực thi thành công!`
                })
            }
        })
    }
}