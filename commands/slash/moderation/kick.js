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
    category: "Information",
    cooldown: 5,
    ownerOnly : false,
    UserPerms: ["BAN_MEMBERS"],
    BotPerms: ["BAN_MEMBERS"],
    run: async (client, interaction, args) => {
        const user = (await interaction.guild.members.fetch(await interaction.options.getUser("user").id))
        const executor = (await interaction.guild.members.fetch(await interaction.member.user.id))
        if (!user.kickable) {
            return interaction.reply({ 
                embeds : [{
                    color : 65484,
                    description : `> \`❌\` The provided user can not be managed by me!`
                }],
                ephemeral : true,
            })
        } else if ((user.roles.highest.position <= executor.roles.highest.position) && executor.id !== interaction.guild.ownerId) {
            return interaction.reply({ 
                embeds : [{
                    color : 65484,
                    description : `> \`❌\` The provided user can not be managed by you!`
                }],
                ephemeral : true,
            })
        } else {
            await user.kick(`By [${executor.user.tag}] ${interaction.options.getString("reason") ? `with reason: [${interaction.options.getString("reason")}]` : ``}`).then(() => {
                return interaction.reply({ 
                    embeds : [{
                        color : 65484,
                        description : `> \`✅\` Kicked ${user.user} [\`${user.user.tag}\`]`
                    }],
                    ephemeral : true,
                })
            }).catch(() => {
                return interaction.reply({ 
                    embeds : [{
                        color : 65484,
                        description : `> \`❌\` Enable to kick the user!`
                    }],
                    ephemeral : true,
                })
            });
        }
    }
}