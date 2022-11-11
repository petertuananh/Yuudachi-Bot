const Discord = require('discord.js')
module.exports = {
    name: "nickname",
    description: "Change user nickname",
    options: [
        {
            name: "user",
            description: "Specify a user",
            type: Discord.ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "text",
            description: "Specify a new nickname",
            type: Discord.ApplicationCommandOptionType.String,
            required: false,
        },
    ],
    UserPerms: ["ManageNicknames"],
    BotPerms: ["ManageNicknames"],
    run: async (client, interaction) => {
        const user = await interaction.guild.members.fetch(interaction.options.getUser("user").id)
        const nickname = interaction.options.getString("text") || user.user.username
        try {
            await user.setNickname(nickname)
            return interaction.reply({ content: `> \`✅\` Tớ đã thay đổi biệt danh của ${user.user.username} thành \`${nickname}\`!`, ephemeral: true })
        } catch (error) {
            return interaction.reply({ content: `> \`❌\` Tớ không thể đổi biệt danh người dùng này!`, ephemeral: true })
        }
    }
}