const Discord = require("discord.js");
module.exports = {
    name: "kick",
    aliases: ["k"],
    category: "Moderation",
    description: "Kick ai đó :c",
    cooldown: 5,
    ownerOnly: false,
    run: async (client, message, args) => {
        try {
            const user = message.mentions.members.first().id || message.guild.members.cache.get(args[0]).id || message.guild.members.cache.find(m => m.displayName.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(m => m.user.username.toLowerCase() === args[0].toLocaleLowerCase())
            const executor = message.member
            if (!user.kickable) {
                return message.reply({
                    embeds: [{
                        color: 65484,
                        description: `> \`❌\` The provided user can not be managed by me!`
                    }],
                    ephemeral: true,
                })
            } else if ((user.roles.highest.position <= executor.roles.highest.position) && executor.id !== message.guild.ownerId) {
                return message.reply({
                    embeds: [{
                        color: 65484,
                        description: `> \`❌\` The provided user can not be managed by you!`
                    }],
                    ephemeral: true,
                })
            } else {
                await user.kick(`By [${executor.user.tag}] ${message.options.getString("reason") ? `with reason: [${message.options.getString("reason")}]` : ``}`).then(() => {
                    return message.reply({
                        embeds: [{
                            color: 65484,
                            description: `> \`✅\` Kicked ${user.user} [\`${user.user.tag}\`]`
                        }],
                        ephemeral: true,
                    })
                }).catch(() => {
                    return message.reply({
                        embeds: [{
                            color: 65484,
                            description: `> \`❌\` Enable to kick the user!`
                        }],
                        ephemeral: true,
                    })
                });
            }
        } catch (error) {
            return message.reply({
                embeds: [{
                    color: 65484,
                    description: `> \`❌\` Enable to kick the user!`
                }],
                ephemeral: true,
            })
        }
    }
}