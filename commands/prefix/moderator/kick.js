const Discord = require("discord.js");
module.exports = {
    name: "kick",
    aliases: ["k"],
    category: "Moderation",
    description: "Kick ai đó :c",
    cooldown: 5,
    ownerOnly: false,
    UserPerms: ["KickMembers"],
    BotPerms: ["KickMembers"],
    run: async (client, message, args) => {
        try {
            const userInput = await message.mentions.members.first() || await message.guild.members.fetch(args[0]) || await message.guild.members.cache.find(m => m.displayName.toLowerCase() === args[0].toLocaleLowerCase()) || await message.guild.members.cache.find(m => m.user.username.toLowerCase() === args[0].toLocaleLowerCase())
            const user = await message.guild.members.cache.get(userInput.id) || await message.guild.members.fetch(userInput.id)
            const reason = args.slice(1).join(" ")
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
                await user.kick(`By [${executor.user.tag}] ${reason ? `with reason: [${reason}]` : ``}`).then(() => {
                    return message.reply({
                        embeds: [{
                            color: 65484,
                            description: `> \`✅\` Kicked ${user.user} [\`${user.user.tag}\`]`
                        }],
                        ephemeral: true,
                    })
                }).catch((e) => {
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
            console.log(error)
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