const Discord = require("discord.js")
const crypto = require("crypto")

module.exports = {
    name: "reactionrole",
    description: "Setup a reactionrole",
    ownerOnly : false,
    voterOnly : true,
    UserPerms: ["ManageRoles"],
    UserPerms: ["ManageRoles"],
    options : [
        {
            name: 'role',
            description: 'Specify a role',
            type: Discord.ApplicationCommandOptionType.Role,
            required: true
        },
        {
            name: 'emoji',
            description: 'Specify an emoji',
            type: Discord.ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'channel',
            description: 'Specify a channel',
            type: Discord.ApplicationCommandOptionType.Channel,
            required: true
        },
        {
            name: 'message',
            description: 'Specify a message id',
            type: Discord.ApplicationCommandOptionType.String,
            required: true
        },
    ],
    run: async (client, interaction, args, err) => {
        const role = await interaction.guild.roles.cache.get(interaction.options.getRole("role").id)
        const channel = await interaction.guild.channels.cache.get(interaction.options.getChannel("channel").id)
        const message = await channel.messages.fetch(interaction.options.getString("message"))
        const emoji = crypto.createHash('sha256').update(interaction.options.getString("emoji")).digest('hex')
        await client.mysql.query(`DELETE FROM MODULE_REACTROLE WHERE guild_id=${interaction.guild.id} && role_id=${role.id}`)
        if (role.position >= interaction.member.roles.highest.position) return interaction.reply({ content : `> \`❌\` This role is higher than your!`, ephemeral : true})
        await message.react(interaction.options.getString("emoji"))
        
        await client.mysql.query(`INSERT INTO MODULE_REACTROLE(guild_id, role_id, emoji, message_id, dms) VALUES (${interaction.guild.id}, ${role.id}, "${emoji}", ${message.id}, "false")`)
        return interaction.reply({ content : `> \`✅\` Done!`, ephemeral : true})
    }
}