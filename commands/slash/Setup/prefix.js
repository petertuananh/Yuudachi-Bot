const Discord = require('discord.js')
const ascii = require("ascii-table")
const { parse, stringify } = require('lossless-json')
module.exports = {
    name: "prefix",
    description: "Cài đặt tiền tố cho bot",
    ownerOnly: false,
    voterOnly: true,
    BotPerms: ["ManageGuild"],
    UserPerms: ["ManageGuild"],
    /**
     * @arg {Discord.Client} client
     * @arg {Discord.Interaction} interaction
     */
    options: [
        {
            name: "default",
            description: "Điều chỉnh tiền tố về mặc định",
            type: Discord.ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "add",
            description: "Thêm tiền tố cho bot",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "prefix",
                    description: "Prefix cần thêm",
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true,
                },
            ]
        },
        {
            name: "remove",
            description: "Xóa tiền tố khỏi bot",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "prefix",
                    description: "Prefix cần xóa",
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true,
                },
            ]
        },
    ],

    run: async (client, interaction, args) => {
        const subCommand = interaction.options.getSubcommand()
        const prefix = interaction.options.getString("prefix")
        client.mysql.query(`SELECT * FROM GUILD_PREFIX WHERE guild_id=${interaction.guild.id}`, async (err, res) => {
            if (subCommand == 'default') {
                return interaction.reply({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setColor("Aqua")
                            .setDescription(`> \`✅\` Prefix đã được điều chỉnh về mặc định: \`${client.config.setting.prefixes}\``)
                    ]
                })
            } else if (subCommand == 'add') {
                if (res[0]) {
                    const prefixes = parse(res[0].prefixes)
                    prefixes.push(prefix)
                    client.mysql.query(`UPDATE GUILD_PREFIX SET prefixes="[${prefixes.toString()}]" WHERE guild_id=${interaction.guild.id}`)
                } else {
                    client.mysql.query(`INSERT INTO GUILD_PREFIX(guild_id, prefixes) VALUES (${interaction.guild.id}, '[${prefix}]')`)
                }
                return interaction.reply({
                    content: `> \`✅\` Thực thi thành công! Đã thêm prefix \`${prefix}\``,
                    allowedMentions: { parse: [] }
                })
            }
        })
    }
}