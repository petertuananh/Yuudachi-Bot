const client = require('../../index.js');
const Discord = require('discord.js');
const cooldowns = new Map();
const db = require("quick.db");
const axios = require('axios')
client.on('messageCreate', async (message) => {
    const embed = new Discord.EmbedBuilder()
        .setColor(00000)
    if (message.author.bot) return;

    if (!message.guild) {
        embed.setDescription(`**・You can't use command in DMs**`)
        return message.reply({
            embeds: [embed]
        })
    }

    if (message.channel.partial) await message.channel.fetch();
    if (message.partial) await message.fetch();

    const mentionRegPrefix = RegExp(`^<@!?${client.user.id}> `);

    let botprefix = await db.fetch(`prefix-${message.guild.id}`);
    if (botprefix === null) {
        botprefix = client.config.bot.prefix
    };

    const prefix = message.content.match(mentionRegPrefix) ? message.content.match(mentionRegPrefix)[0] : botprefix;

    if (!message.content.startsWith(prefix)) return;
    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();
    const command = client.commands.get(cmd.toLowerCase()) || client.commands.find((cmds) => cmds.aliases && cmds.aliases.includes(cmd));
	if (!command) return;

    if (command) {
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection())
        }

        const currentTime = Date.now()
        const timeStamps = cooldowns.get(command.name)
        const cooldownAmount = (command.cooldown) * 1000

        if (timeStamps.has(message.guild.id)) {
            const expTime = timeStamps.get(message.guild.id) + cooldownAmount
            if (currentTime < expTime) {
                const timeLeft = (expTime - currentTime) / 1000
                const tmotEmbed = new Discord.MessageEmbed()
                    .setColor("RED")
                    .setTitle(`COOLDOWN ❌`, client.user.displayAvatarURL())
                    .setDescription(`Pls wait \`${timeLeft.toFixed(1)}\`s to use \`${command.name}\` !`)
                    .setTimestamp()
                return message.channel.send({
                    embeds: [tmotEmbed]
                })
        
                
            }
        }
        timeStamps.set(message.guild.id, currentTime)
        setTimeout(() => {
            timeStamps.delete(message.guild.id)
        }, cooldownAmount)

        if (!message.guild.me.permissions.has(["SEND_MESSAGES", "EMBED_LINKS"])){
            embed.setTitle(`**Permissions**`)
            embed.setDescription(`Bot need: \`SEND MESSAGES\``)
            return message.member.send({embeds: [embed]}).catch(err => console.log(err))
        }
        if (!message.member.permissions.has(command.UserPerms || [])){
            embed.setTitle(`**Permissions**`)
            embed.setDescription(`You need: \`${command.UserPerms || []}\``)
            return message.reply({embeds: [embed]}).catch(err => console.log(err))
        }
        if (!message.guild.me.permissions.has(command.BotPerms || [])){
            embed.setTitle(`**Permissions**`)
            embed.setDescription(`Bot need: \`${command.BotPerms || []}\``)
            return message.reply({embeds: [embed]}).catch(err => console.log(err))
        }

        if (command.ownerOnly) {
            if (message.author.id !== client.config.general.ownerID) {
                embed.setTitle(`**Permissions**`)
                embed.setDescription(`**・Limited this commands to owners only**`)
                return message.channel.send({
                    embeds: [embed]
                })
            }
        }
        if (command.inVoiceChannel && !message.member.voice.channel) {
            embed.setTitle(`**Voice**`)
            embed.setDescription(`**・Bạn phải vào kênh thoại trước để dùng lệnh này**`)
            return message.channel.send({
                embeds: [embed]
            })
        }

        if (command.hostOnly && !message.guild.members.cache.get(message.author.id).roles.cache.has('963469600404684841')) return message.reply('> :x: Lệnh này chỉ dành cho người có role đặc biệt!')
        command.run(client, message, args, prefix);
    }
    

})