const Discord = require("discord.js");
const ms = require("ms")

module.exports = {
    name: "timeout",
    aliases: ["to"],
    category: "Moderation",
    description: "Đặt trạng thái chờ cho người dùng",
    cooldown: 5,
    ownerOnly: false,
    UserPerms: ["ModerateMembers"],
    BotPerms: ["ModerateMembers"],
    run: async (client, message, args) => {
        try {
            const userInput = await message.mentions.members.first() || await message.guild.members.fetch(args[0]) || await message.guild.members.cache.find(m => m.displayName.toLowerCase() === args[0].toLocaleLowerCase()) || await message.guild.members.cache.find(m => m.user.username.toLowerCase() === args[0].toLocaleLowerCase())
            const user = await message.guild.members.cache.get(userInput.id) || await message.guild.members.fetch(userInput.id)
            const reason = args.slice(2).join(" ")
            const time = {
                input : args[1],
                replaced : await replace(args[1]),
                ms : ms(await replace(args[1]))
            }
            const executor = message.member
            if (!user.manageable) {
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
                await user.timeout(time.ms, `By [${executor.user.tag}] in ${time.input} ${reason ? `with reason: [${reason}]` : ``}`)
                .then(() => {
                    return message.reply({
                        embeds: [{
                            color: 65484,
                            description: `> \`✅\` Timed out ${user.user} [\`${user.user.tag}\`]`
                        }],
                        ephemeral: true,
                    })
                }).catch((e) => {
                    return message.reply({
                        embeds: [{
                            color: 65484,
                            description: `> \`❌\` Enable to timeout the user!`
                        }],
                        ephemeral: true,
                    })
                });
            }
        } catch (error) {
            return message.reply({
                embeds: [{
                    color: 65484,
                    description: `> \`❌\` Enable to timeout the user!`
                }],
                ephemeral: true,
            })
        }
    }
}
const replace = async (text) => {
	text = text.replace(/day/g, `d`);
    text = text.replace(/days/g, `d`);
    text = text.replace(/DAY/g, `d`);
    text = text.replace(/DAYS/g, `d`);
    text = text.replace(/ngày/g, `d`);
    text = text.replace(/NGÀY/g, `d`);
    text = text.replace(/D/g, `d`);
    return text
}