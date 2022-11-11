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
        const userId = await message.guild.members.fetch(args[0]).catch(() => {})
        const member = message.mentions.members.first() || userId ||
        message.guild.members.cache.find(m => m.displayName.toLowerCase() === args[0].toLocaleLowerCase()) || 
        message.guild.members.cache.find(m => m.user.username.toLowerCase() === args[0].toLocaleLowerCase());
        const id = args[0]
        
        const executor = message.member
        const reason = `Bởi [${executor.user.tag}] ${args.slice(1).join(" ") ? `với lý do: ${args.slice(1).join(" ")}` : ``}`

        if (member) {
            if (!member.kickable) {
                return message.reply({
                    embeds: [{
                        color: 65484,
                        description: `> \`❌\` Tớ không thể kick người dùng này!`
                    }],
                    ephemeral: true,
                })
            } else if ((member.roles.highest.position >= executor.roles.highest.position) && (executor.id !== message.guild.ownerId)) {
                return message.reply({
                    embeds: [{
                        color: 65484,
                        description: `> \`❌\` Cậu không thể kick người dùng này!`
                    }],
                    ephemeral: true,
                })
            } else {
                await member.kick(reason)
                .then(() => {
                    return message.reply({
                        embeds: [{
                            color: 65484,
                            description: `> \`✅\` Đã kick ${member.user} [\`${member.user.tag}\`]`
                        }],
                        ephemeral: true,
                    })
                })
                .catch((e) => {
                    return message.reply({
                        embeds: [{
                            color: 65484,
                            description: `> \`❌\` Không thể kick người dùng này!`
                        }],
                        ephemeral: true,
                    })
                });
            }
        } else {
            return message.reply({
                embeds: [{
                    color: 65484,
                    description: `> \`❌\` Không thể tìm thấy người dùng này!`
                }],
                ephemeral: true,
            })
        }
    }
}