const Discord = require("discord.js");

module.exports = {
    name: "kick",
    description: "Kick ai đó :c",
    options: [
        {
            name: "user",
            description: "Specify a user",
            type: Discord.ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "reason",
            description: "The reason",
            type: Discord.ApplicationCommandOptionType.String,
            required: false,
        },
    ],
    category: "Moderation",
    cooldown: 5,
    ownerOnly: false,
    UserPerms: ["KickMembers"],
    BotPerms: ["KickMembers"],
    run: async (client, interaction, args) => {
        try {
            const userInput = await interaction.options.getUser("user").id
            const user = await interaction.guild.members.cache.get(userInput) || await interaction.guild.members.fetch(userInput)
            if (!user) return
            const executor = (await interaction.guild.members.fetch(await interaction.member.user.id))
            if (!user.kickable) {
                return interaction.reply({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setColor("Aqua")
                            .setDescription(`> \`❌\` The provided user can not be managed by me!`)
                    ],
                    ephemeral: true,
                })
            } else if ((user.roles.highest.position <= executor.roles.highest.position) && executor.id !== interaction.guild.ownerId) {
                return interaction.reply({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setColor("Aqua")
                            .setDescription(`> \`❌\` The provided user can not be managed by you!`)
                    ],
                    ephemeral: true,
                })
            } else {
                await user.kick(`By [${executor.user.tag}] ${interaction.options.getString("reason") ? `with reason: [${interaction.options.getString("reason")}]` : ``}`).then(() => {
                    return interaction.reply({
                        embeds: [
                            new Discord.EmbedBuilder()
                                .setColor("Aqua")
                                .setDescription(`> \`✅\` Kicked ${user.user} [\`${user.user.tag}\`]`)
                        ],
                        ephemeral: false,
                    })
                })
                    .catch(() => {
                        return interaction.reply({
                            embeds: [
                                new Discord.EmbedBuilder()
                                    .setColor("Aqua")
                                    .setDescription(`> \`❌\` Enable to kick the user!`)
                            ],
                            ephemeral: true,
                        })
                    });
            }
        } catch (error) {
            return interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor("Aqua")
                        .setDescription(`> \`❌\` Enable to kick the user!`)
                ],
                ephemeral: true,
            })
        }
    }
}