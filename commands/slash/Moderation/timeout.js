const Discord = require("discord.js");
const ms = require("ms")
module.exports = {
    name: "timeout",
    description: "Đặt thời gian chờ cho ai đó :v",
    options: [
        {
            name: "user",
            description: "Specify a user",
            type: Discord.ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "time",
            description: "Timeout in?",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "reason",
            description: "The reason",
            type: Discord.ApplicationCommandOptionType.String,
            required: false,
        },
    ],
    category: "Moderation",
    cooldown: 5,
    ownerOnly: false,
    UserPerms: ["ModerateMembers"],
    BotPerms: ["ModerateMembers"],
    run: async (client, interaction, args) => {
        try {
            const userInput = await interaction.options.getUser("user").id
            const user = await interaction.guild.members.cache.get(userInput) || await interaction.guild.members.fetch(userInput)
            if (!user) return
            const time = {
                input : interaction.options.getString("time"),
                replaced : await replace(interaction.options.getString("time")),
                ms : ms(await replace(interaction.options.getString("time")))
            }
            const executor = (await interaction.guild.members.fetch(interaction.member.user.id))
            if (!user.manageable) {
                return interaction.reply({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setColor("Aqua")
                            .setDescription(`> \`❌\` The provided user can not be managed by me!`)
                    ],
                    ephemeral: true,
                })
            } else if ((user.roles.highest.position >= executor.roles.highest.position) && (executor.id !== interaction.guild.ownerId)) {
                return interaction.reply({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setColor("Aqua")
                            .setDescription(`> \`❌\` The provided user can not be managed by you!`)
                    ],
                    ephemeral: true,
                })
            } else {
                await user.timeout(time.ms, `By [${executor.user.tag}] in ${time.input} ${interaction.options.getString("reason") ? `with reason: [${interaction.options.getString("reason")}]` : ``}`)
                .then(() => {
                    return interaction.reply({ 
                        embeds : [{
                            color : 65484,
                            description : `> \`✅\` Timed out ${user.user} [\`${user.user.tag}\`] in \`${time.input}\``
                        }],
                        ephemeral : true,
                    })
                })
                .catch((e) => {
                    return interaction.reply({
                        embeds: [
                            new Discord.EmbedBuilder()
                                .setColor("Aqua")
                                .setDescription(`> \`❌\` Enable to timeout the user!`)
                        ],
                        ephemeral: true,
                    })
                });
            }
        } catch (error) {
            return interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor("Aqua")
                        .setDescription(`> \`❌\` Enable to timeout the user!`)
                ],
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