const Discord = require("discord.js");
module.exports = {
    name: "ban",
    aliases: ["b"],
    category: "Moderation",
    description: "Ban ai đó :c",
    cooldown: 5,
    ownerOnly: false,
    UserPerms: ["BanMembers"],
    BotPerms: ["BanMembers"],
    run: async (client, message, args) => {
        try {
            const userInput = await message.mentions.members.first() || await message.guild.members.fetch(args[0]) || await message.guild.members.cache.find(m => m.displayName.toLowerCase() === args[0].toLocaleLowerCase()) || await message.guild.members.cache.find(m => m.user.username.toLowerCase() === args[0].toLocaleLowerCase())
            const user = await message.guild.members.cache.get(userInput.id) || await message.guild.members.fetch(userInput.id)
            const reason = args.slice(1).join(" ")
            const executor = message.member
            if (!user.bannable) {
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
                await user.ban({
                    reason : `By [${executor.user.tag}] ${reason ? `with reason: [${reason}]` : ``}`
                })
                .then(() => {
                    return message.reply({
                        embeds: [{
                            color: 65484,
                            description: `> \`✅\` Banned ${user.user} [\`${user.user.tag}\`]`
                        }],
                        ephemeral: true,
                    })
                }).catch((e) => {
                    return message.reply({
                        embeds: [{
                            color: 65484,
                            description: `> \`❌\` Enable to ban the user!`
                        }],
                        ephemeral: true,
                    })
                });
            }
        } catch (error) {
            return message.reply({
                embeds: [{
                    color: 65484,
                    description: `> \`❌\` Enable to ban the user!`
                }],
                ephemeral: true,
            })
        }
    }
}