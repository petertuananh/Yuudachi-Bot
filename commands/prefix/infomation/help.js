const Discord = require("discord.js");

module.exports = {
    name: "help",
    aliases: ["h"],
    category: "Information",
    description: "Show all command",
    cooldown: 5,
    ownerOnly : false,
    run: async (client, message, args) => {
        const commands1 = client.commands
        const commands2 = client.slashcommands
        const embed2 = new Discord.EmbedBuilder()
            .setAuthor({ name: `${client.user.username} help`, iconURL: client.user.displayAvatarURL({ format: "png", dynamic: true, size: 4096 }) })
            .setThumbnail(client.user.displayAvatarURL({ format: "png", dynamic: true, size: 4096 }))
            .setFooter({ text: `Request by ${message.member.user.username}` , iconURL: message.member.user.displayAvatarURL() })
            .setColor(`Aqua`)
            .addFields(
                { name: 'Slash', value: `${commands2.map(x => ` > ┕ \`${x.name}\` \n`).join('')}`, inline: true },
                { name: 'Prefix', value: `${commands1.map(x => ` > ┕ \`${x.name}\` \n`).join('')}`, inline: true },
            )
        return message.reply({embeds: [embed2]})
    }
}
//(${x.description})