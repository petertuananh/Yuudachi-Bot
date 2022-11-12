const Discord = require("discord.js");

module.exports = {
    name: "ban",
    description: "Ban ai đó :c",
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
    UserPerms: ["BanMembers"],
    BotPerms: ["BanMembers"],
    run: async (client, interaction, args) => {
        const member = await interaction.guild.members.fetch(await interaction.options.getUser("user").id).catch(() => {})
        const id = await interaction.options.getUser("user").id
        
        const executor = interaction.member
        const reason = `Bởi [${executor.user.tag}] ${interaction.options.getString("reason") ? `với lý do: ${interaction.options.getString("reason")}` : ``}`

        if (member) {
            if (!member.bannable) {
                return interaction.reply({
                    embeds: [{
                        color: 65484,
                        description: `> \`❌\` Tớ không thể cấm người dùng này!`
                    }],
                    ephemeral: true,
                })
            } else if ((member.roles.highest.position >= executor.roles.highest.position) && (executor.id !== interaction.guild.ownerId)) {
                return interaction.reply({
                    embeds: [{
                        color: 65484,
                        description: `> \`❌\` Cậu không thể cấm người dùng này!`
                    }],
                    ephemeral: true,
                })
            } else {
                await member.ban({ reason : reason })
                .then(() => {
                    return interaction.reply({
                        embeds: [{
                            color: 65484,
                            description: `> \`✅\` Đã cấm ${member.user} [\`${member.user.tag}\`]`
                        }],
                        ephemeral: false,
                    })
                })
                .catch((e) => {
                    return interaction.reply({
                        embeds: [{
                            color: 65484,
                            description: `> \`❌\` Không thể cấm người dùng này!`
                        }],
                        ephemeral: true,
                    })
                });
            }
        } else if (!member && id) {
            interaction.guild.members.ban(id, {reason: reason})
            .then(() => {
                return interaction.reply({
                    embeds: [{
                        color: 65484,
                        description: `> \`✅\` Đã cấm <@${id}> [\`${id}\`]`
                    }],
                    ephemeral: true,
                })
            })
            .catch((e) => {
                console.log(e)
                return interaction.reply({
                    embeds: [{
                        color: 65484,
                        description: `> \`❌\` Không thể cấm người dùng này!`
                    }],
                    ephemeral: true,
                })
            });
        } else {
            return interaction.reply({
                embeds: [{
                    color: 65484,
                    description: `> \`❌\` Không thể tìm thấy người dùng này!`
                }],
                ephemeral: true,
            })
        }
    }
}