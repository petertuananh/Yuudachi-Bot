const Discord = require("discord.js");
module.exports = {
    name: "help",
    description: "Show all command",
    ownerOnly : false,
    run: async (client, interaction, args, err) => {
        const commands1 = client.commands
        const commands2 = client.slashcommands
        const embed2 = new Discord.EmbedBuilder()
            .setAuthor({ name: `${client.user.username} help`, iconURL: client.user.displayAvatarURL({ format: "png", dynamic: true, size: 4096 }) })
            .setThumbnail(client.user.displayAvatarURL({ format: "png", dynamic: true, size: 4096 }))
            .setFooter({ text: `Request by ${interaction.member.user.username}` , iconURL: interaction.member.user.displayAvatarURL() })
            .setColor(`Aqua`)
            .addFields(
                { name: 'Slash', value: `${commands2.map(x => ` > ┕ \`${x.name}\` \n`).join('')}`, inline: true },
                { name: 'Prefix', value: `${commands1.map(x => ` > ┕ \`${x.name}\` \n`).join('')}`, inline: true },
            )
        return interaction.reply({embeds: [embed2]})
    }
}
