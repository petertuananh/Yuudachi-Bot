const { EmbedBuilder } = require('discord.js')
const { inspect } = require('util')
const config = require('../../../config.json')

module.exports = {
    name: 'eval',
    category: 'Admin',
    description: 'Evalculate Javascript commands',
    ownerOnly: true,
    run: async (client, message, args) => {
        const evalEmbed = new EmbedBuilder()
        .setAuthor({
            name: `[Owner Only]: 💠Executing JavaScript from message!💠`,
            iconURL: client.user.avatarURL()
        })
        .setColor(config.setting.embeds.large.color)
        .setImage(config.setting.embeds.large.image)
        .setFooter({
            text: `${message.guild.name} | ${message.guild.id}`,
            iconURL: message.guild.iconURL()
        })
        .setTimestamp()

        if (!args[0] && args[0] !== 'async') {
            evalEmbed.setDescription(`:wrench: [Owner Only]: 💠Executing JavaScript from message!💠`)
            return message.channel.send({
                embeds: [evalEmbed]
            })
        }
        const code = args.reduce((array, arg, index) => {
            if (args[0] === 'async' && index === 0) return array
            array.push(arg)
            return array
        }, []).join(' ')
        try {
            if (args[0] === 'async' && !args[1]) throw new TypeError('Undefined promise commands!')
            const executedCode = await eval(args[0] && args[0] === 'async' ? `(async function() {${code}})()`: code)
            evalEmbed.addFields([{
                name: 'Type:',
                value: `\`\`\`prolog\n${typeof(executedCode)}\`\`\``
            }, {
                name: 'Tốc độ:',
                value: `\`\`\`ytml\n${client.ws.ping}ms\`\`\``
            }, {
                name: 'Code:',
                value: `\`\`\`js\n${code}\`\`\``
            }, {
                name: 'Output:',
                value: `\`\`\`js\n${inspect(executedCode, { depth: 0})}\`\`\``
            }])
            message.channel.send({
                embeds: [evalEmbed]
            })
        } catch (error) {
            evalEmbed.setDescription(`:warning: Have an error!`)
            .addFields([{
                name: 'Code:',
                value: `\`\`\`js\n${code}\`\`\``
            }, {
                name: 'Error:',
                value: `\`\`\`js\n${error.message}\`\`\``
            }])
            message.channel.send({
                embeds: [evalEmbed]
            })
        }
    }
}