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
            .setColor("AQUA")
            .addField(`Slash`, commands2.map(x => ` > ┕ \`${x.name} (${x.description})\` \n`).join(''),)
            .addField(`Prefix`, commands1.map(x => ` > ┕ \`${x.name} (${x.description})\` \n`).join(''),)
        return interaction.reply({embeds: [embed2]})
    }
}
