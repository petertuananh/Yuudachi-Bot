const Discord = require('discord.js')
module.exports = {
    name: "unban",
    description: "Unban a user",
    options: [
        {
            name: "user",
            description: "Unban a user",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "id",
                    description: "Specify a user",
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: "reason",
                    description: "Specify a reason",
                    type: Discord.ApplicationCommandOptionType.String,
                    required: false,
                },
            ]
        },
        {
            name: "all",
            description: "Unban all banned user",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "reason",
                    description: "Specify a reason",
                    type: Discord.ApplicationCommandOptionType.String,
                    required: false,
                },
            ]
        },
    ],
    UserPerms: ["BanMembers"],
    BotPerms: ["BanMembers"],
    run: async (client, interaction) => {
        const executor = interaction.member
        const reason = `Bởi [${executor.user.tag}] ${interaction.options.getString("reason") ? `với lý do: ${interaction.options.getString("reason")}` : ``}`
        const id = interaction.options.getString("id")
        const choice = interaction.options.getSubcommand()
        if (choice == 'user') {
            try {
                await interaction.guild.bans.fetch(id)
            } catch (e) {
                return interaction.reply({ content: `> \`❌\` Người dùng này chưa bị cấm!`, ephemeral: true })
            }
            try {
                await interaction.guild.members.unban(id, reason)
                return interaction.reply({
                    embeds: [{
                        color: 65484,
                        description: `> \`✅\` Tớ đã bỏ cấm cho <@${id}> [\`${id}\`]`
                    }],
                    ephemeral: false,
                })
            } catch (error) {
                return interaction.reply({ content: `> \`❌\` Ơ, tớ bị lỗi gì đó rồi!`, ephemeral: true })
            }
        } else if (choice == 'all') {
            try {
                interaction.guild.bans.fetch().then(async bans => {
                    await bans.forEach(ban => {
                        interaction.guild.members.unban(ban.user.id, reason);
                    });
                }).then(() => {
                    return interaction.reply({
                        embeds: [{
                            color: 65484,
                            description: `> \`✅\` Tớ đã bỏ cấm cho tất cả!`
                        }],
                        ephemeral: false,
                    })
                }).catch(e => { })
            } catch (error) {
                console.log(error)
                return interaction.reply({ content: `> \`❌\` Ơ, tớ bị lỗi gì đó rồi!`, ephemeral: true })
            }
        }

    }
}