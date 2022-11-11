const Discord = require('discord.js')

module.exports = {
    name: 'purge',
    aliases: ['prune'],
    category: 'Moderator',
    description: 'Xoá nhiều tin nhắn cùng 1 lúc.',
    cooldown: 5,
    UserPerm: ['ManageMessages'],
    BotPerm: ['ManageMessages'],
    /**
     * @arg {Discord.Client} client
     * @arg {Discord.Message} message
     * @arg {string[]} args
     */
    run: (client, message, args) => {
        const deleteCount = Number(args[0])
        if (!deleteCount) return message.reply()
        if (deleteCount <= 0 || deleteCount >= 100) return message.reply()
        if (!Number.isInteger(deleteCount)) return message.reply()

        message.channel.send('Chu')
    }
}