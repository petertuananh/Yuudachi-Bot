const client = require('../../index.js');
const Discord = require('discord.js');
const cooldowns = new Map();
const { parse, stringify } = require('lossless-json')

client.on('messageCreate', async (message) => {
    const embed = new Discord.EmbedBuilder()
        .setColor(`Aqua`)
    if (message.author.bot) return;
    if (!message.guild) {
        embed.setDescription(`**・You can't use command in DMs**`)
        return message.reply({
            embeds: [embed]
        })
    }
    // console.log(message.interaction)
    if (message.channel.partial) await message.channel.fetch();
    if (message.partial) await message.fetch();
    if (message.content == client.user || message.content == client.user.tag || message.content == `<@${client.user.id}>` || message.content == `<@!${client.user.id}>`){
        message.reply({
            embeds : [
                new Discord.EmbedBuilder()
                    .setColor("Aqua")
                    .setDescription(`> Xin chào, tớ là ${client.user.username} - một con bot được phát triển bởi vài học sinh tại Việt Nam :flag_vn:\n> Prefix mặc định của tớ là \`${client.config.setting.prefixes}\` và slash command \`/\`\n> Nếu cần hỗ trợ, nhấn vào [đây](https://discord.gg/mayduahuongnoi) hoặc DMs \`Peter Tuan Anh#0001\` or \`Chino#4330\``)
            ]
        })
    } else if (message.interaction) {
        console.log(message.interaction)
        client.mysql.query(`SELECT * FROM MODULE_CMDWRONGAREA WHERE guild_id=${message.guild.id}`, async (err, res) => {
            if (!res[0]) return;
            const channels = parse(res[0].channels)
            channels.forEach(async channel => {
                if (channel == message.channel) return;
                console.log(message.interaction)
            })
        })
    } else {
        const mentionRegPrefix = RegExp(`^<@!?${client.user.id}> `);
        client.config.setting.prefixes.forEach(async prefixes => {
            if (!message.content.toLocaleLowerCase().includes(prefixes)) return
            const prefix = message.content.match(mentionRegPrefix) ? message.content.match(mentionRegPrefix)[0] : prefixes;
            if (!message.content.startsWith(prefix)) return;
            if (!message.member) message.member = await message.guild.fetchMember(message);
            const args = message.content.slice(prefix.length).trim().split(/ +/);
            const cmd = args.shift().toLowerCase();
            const command = client.commands.get(cmd.toLowerCase()) || client.commands.find((cmds) => cmds.aliases && cmds.aliases.includes(cmd));
            if (!command) return;
            const me = await message.guild.members.fetch(client.user.id)
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
                        const tmotEmbed = new Discord.EmbedBuilder()
                            .setColor("Aqua")
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
        
                if (!me.permissions.has(["SendMessages", "EmbedLinks"])){
                    embed.setTitle(`**Permissions**`)
                    embed.setDescription(`Bot need: \`SendMessages\``)
                    return message.member.send({embeds: [embed]}).catch(err => console.log(err))
                }
                if (!message.member.permissions.has(command.UserPerms || [])){
                    embed.setTitle(`**Permissions**`)
                    embed.setDescription(`You need: \`${command.UserPerms || []}\``)
                    return message.reply({embeds: [embed]}).catch(err => console.log(err))
                }
                if (!me.permissions.has(command.BotPerms || [])){
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
                if (command.inVoice && !message.member.voice.channel) {
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
    }
})