const Discord = require('discord.js');
const client = require('../../index.js');
const cooldowns = new Map();
client.on('interactionCreate', interaction => {

    const embed = new Discord.EmbedBuilder()
        .setColor(00000)

    if (!interaction.guild) {
        embed.setDescription(`**・You can't use slash command in DMs**`)
        return interaction.reply({
            embeds: [embed]
        })
    }

    if (interaction.isCommand() || interaction.isContextMenu()) {
        const command = client.slashcommands.get(interaction.commandName);

        embed.setDescription('**・An error occured while running this command ✖**')
        if (!command) return interaction.reply({
            embeds : [embed],
            ephemeral: true
        }) && client.slashcommands.delete(interaction.commandName);;

        const args = [];

        for (let option of interaction.options.data) {
            if (option.type === 'SUB_COMMAND') {
                if (option.name) args.push(option.name);
                option.options?.forEach(x => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }


        if (command.ownerGuild) {
            const trustedEmbed = new Discord.EmbedBuilder()
            trustedEmbed.setColor('RED')
            trustedEmbed.setTitle(`**Permissions**`)
            trustedEmbed.setDescription(`Only owner can use this command!`)
            if (interaction.member.id !== interaction.guild.ownerId){
                return interaction.reply({embeds: [trustedEmbed], ephemeral: true})
            }
        }
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection())
        }

        const currentTime = Date.now()
        const timeStamps = cooldowns.get(command.name)
        const cooldownAmount = (command.cooldown) * 1000

        if (timeStamps.has(interaction.guild.id)) {
            const expTime = timeStamps.get(interaction.guild.id) + cooldownAmount
            if (currentTime < expTime) {
                const timeLeft = (expTime - currentTime) / 1000
                const tmotEmbed = new Discord.Discord.EmbedBuilder()
                    .setColor("RED")
                    .setTitle(`COOLDOWN ❌`, client.user.displayAvatarURL())
                    .setDescription(`Pls wait \`${timeLeft.toFixed(1)}\`s to use \`${command.name}\` !`)
                    .setTimestamp()
                return interaction.reply({
                    embeds: [tmotEmbed]
                })
        
                
            }
        }
        timeStamps.set(interaction.guild.id, currentTime)
        setTimeout(() => {
            timeStamps.delete(interaction.guild.id)
        }, cooldownAmount)

        // if (!interaction.guild.me.permissions.has(["SEND_MESSAGES", "EMBED_LINKS"])){
        //     embed.setTitle(`**Permissions**`)
        //     embed.setDescription(`Bot need: \`SEND_MESSAGES\``)
        //     return interaction.member.send({embeds: [embed]}).catch(err => console.log(err))
        // }
        if (!interaction.member.permissions.has(command.UserPerms || [])){
            embed.setTitle(`**Permissions**`)
            embed.setDescription(`You need: \`${command.UserPerms || []}\``)
            return interaction.reply({embeds: [embed]}).catch(err => console.log(err))
        }
        // if (!interaction.guild.me.permissions.has(command.BotPerms || [])){
        //     embed.setTitle(`**Permissions**`)
        //     embed.setDescription(`Bot need: \`${command.BotPerms || []}\``)
        //     return interaction.reply({embeds: [embed]}).catch(err => console.log(err))
        // }

        command.run(client, interaction, args)
    }
})