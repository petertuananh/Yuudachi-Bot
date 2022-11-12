const Discord = require('discord.js');
const client = require('../../index.js');
const cooldowns = new Map();
client.on('interactionCreate', async interaction => {
    const me = await interaction.guild.members.fetch(client.user.id)
    musicButton(interaction, me)
    commands(interaction, me)
})


async function musicButton(interaction, me) {
    if (!interaction.isButton()) return;
    const queue = client.distube.getQueue(interaction)
    const userUsedBtn = await interaction.guild.members.fetch(interaction.member.id)
    if (interaction.customId.startsWith("music_") && !queue) {
        return interaction.reply({ content: `> \`❌\` Không có gì trong hàng đợi!`, embeds : [], components : [], ephemeral: true })
    } else if (interaction.customId.startsWith("music_") && !userUsedBtn.voice.channel) {
        return interaction.reply({ content: `> \`❌\` Bạn phải chung kênh thoại với tớ để sử dụng!`, ephemeral: true})
    } else if (interaction.customId.startsWith("music_") && userUsedBtn.voice.channel.id !== me.voice.channel.id) {
        return interaction.reply({ content: `> \`❌\` Bạn phải chung kênh thoại với tớ để sử dụng!`, ephemeral: true})
    }
    if (interaction.customId == 'music_previous') {
        const song = await queue.previous()
        return interaction.reply({ content: `> \`✅\` Now playing: ${song.name}`, ephemeral : true})
    } else if (interaction.customId == 'music_pause') {
        const row = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
                .setStyle("Primary")
                .setCustomId("music_previous")
                .setEmoji(`⏮️`),
            new Discord.ButtonBuilder()
                .setStyle("Primary")
                .setCustomId("music_resume")
                .setEmoji(`▶️`),
            new Discord.ButtonBuilder()
                .setStyle("Primary")
                .setCustomId("music_skip")
                .setEmoji(`⏭️`),
            new Discord.ButtonBuilder()
                .setStyle("Primary")
                .setCustomId("music_loop")
                .setEmoji(`🔁`),
            new Discord.ButtonBuilder()
                .setStyle("Primary")
                .setCustomId("music_queue")
                .setEmoji(`📃`),
        )
        const row2 = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
                .setStyle("Danger")
                .setCustomId("music_stop")
                .setEmoji(`⛔`),
            new Discord.ButtonBuilder()
                .setStyle("Success")
                .setCustomId("music_volume_up")
                .setEmoji(`🔊`),
            new Discord.ButtonBuilder()
                .setStyle("Success")
                .setCustomId("music_volume_down")
                .setEmoji(`🔉`),
            new Discord.ButtonBuilder()
                .setStyle("Primary")
                .setCustomId("music_autoplay")
                .setLabel("Auto")
                .setEmoji(`▶️`),
        )
        await queue.pause()
        await interaction.message.edit({ components : [row, row2]}) 
        return interaction.reply({ content: `> \`✅\` Paused`, ephemeral : true })
    } else if (interaction.customId == 'music_resume') {
        const row = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
                .setStyle("Primary")
                .setCustomId("music_previous")
                .setEmoji(`⏮️`),
            new Discord.ButtonBuilder()
                .setStyle("Primary")
                .setCustomId("music_pause")
                .setEmoji(`⏸️`),
            new Discord.ButtonBuilder()
                .setStyle("Primary")
                .setCustomId("music_skip")
                .setEmoji(`⏭️`),
            new Discord.ButtonBuilder()
                .setStyle("Primary")
                .setCustomId("music_loop")
                .setEmoji(`🔁`),
            new Discord.ButtonBuilder()
                .setStyle("Primary")
                .setCustomId("music_queue")
                .setEmoji(`📃`),
        )
        const row2 = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
                .setStyle("Danger")
                .setCustomId("music_stop")
                .setEmoji(`⛔`),
            new Discord.ButtonBuilder()
                .setStyle("Success")
                .setCustomId("music_volume_up")
                .setEmoji(`🔊`),
            new Discord.ButtonBuilder()
                .setStyle("Success")
                .setCustomId("music_volume_down")
                .setEmoji(`🔉`),
            new Discord.ButtonBuilder()
                .setStyle("Primary")
                .setCustomId("music_autoplay")
                .setLabel("Auto")
                .setEmoji(`▶️`),
        )
        await queue.resume()
        await interaction.message.edit({ components : [row, row2]}) 
        return interaction.reply({ content: `> \`✅\` Resumed`, ephemeral : true })
    } else if (interaction.customId == 'music_skip') {
        const song = await queue.skip()
        return interaction.reply({ content: `> \`✅\` Now playing: ${song.name}`, ephemeral : true })
    } else if (interaction.customId == 'music_loop') {
        const nowMode = await queue.repeatMode
        if (nowMode === 0) {
            await queue.setRepeatMode(2);
            return interaction.reply({ content: `> \`✅\` Đã bật chế độ lặp lại!`, ephemeral : true })
        } else {
            await queue.setRepeatMode(0);
            return interaction.reply({ content: `> \`✅\` Đã tắt chế độ lặp lại!`, ephemeral : true })
        }
    } else if (interaction.customId == 'music_stop') {
        await queue.stop()
        return interaction.reply({ content: `> \`✅\` Stopped the queue!`, ephemeral : true })
    } else if (interaction.customId == 'music_volume_up') {
        const nowVolume = await queue.volume
        await queue.setVolume(nowVolume + 10);
        return interaction.reply({ content: `> \`✅\` Now volume : \`${queue.volume}\``, ephemeral : true })
    } else if (interaction.customId == 'music_volume_down') {
        const nowVolume = await queue.volume
        await queue.setVolume(nowVolume - 10);
        return interaction.reply({ content: `> \`✅\` Now volume : \`${queue.volume}\``, ephemeral : true })
    } else if (interaction.customId == 'music_autoplay') {
        const autoplay = queue.toggleAutoplay()
        return interaction.reply({ content: `> \`✅\` AutoPlay: \`${autoplay ? 'On' : 'Off'}\``, ephemeral : true })
    } else if (interaction.customId == 'music_queue') {
        const q = queue.songs
            .map((song, i) => `${i === 0 ? 'Playing:' : `${i}.`} ${song.name} - \`${song.formattedDuration}\``)
            .join('\n')

        const tracks = queue.songs
            .map((song, i) => `**${i + 1}** - [${song.name}](${song.url}) | ${song.formattedDuration}
        Requested by : ${song.user}`)

        const songs = queue.songs.length;
        const nextSongs = songs > 10 ? `And **${songs - 10}** another song...` : `In the playlist **${songs}** songs...`;

        const msg2 = new Discord.MessageEmbed()
            .setColor("AQUA")
            .setAuthor({ name: 'Playlists', iconURL: 'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/logo.gif' })
            .setDescription(`${tracks.slice(0, 10).join('\n')}\n\n${nextSongs}`)
            .addField(`Now playing:`, `[${queue.songs[0].name}](${queue.songs[0].url}) - ${queue.songs[0].formattedDuration}  Requested by: ${queue.songs[0].user}`, false)
            .addField(`Total play time:`, `${queue.formattedDuration}`, true)
            .addField(`Total number of songs:`, `${songs}`, true)
        await interaction.reply({ embeds: [msg2], ephemeral : true })
    }
}


async function commands(interaction, me) {
    const embed = new Discord.EmbedBuilder()
        .setColor(00000)

    if (!interaction.guild) {
        embed.setDescription(`**・You can't use slash command in DMs**`)
        return interaction.reply({
            embeds: [embed]
        })
    }
    if (interaction.isCommand()) {

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

        if (!me.permissions.has(["SendMessages", "EmbedLinks"])){
            embed.setTitle(`**Permissions**`)
            embed.setDescription(`Bot need: \`SEND_MESSAGES\``)
            return interaction.member.send({embeds: [embed]}).catch(err => console.log(err))
        }
        if (!interaction.member.permissions.has(command.UserPerms || [])){
            embed.setTitle(`**Permissions**`)
            embed.setDescription(`You need: \`${command.UserPerms || []}\``)
            return interaction.reply({embeds: [embed]}).catch(err => console.log(err))
        }
        if (!me.permissions.has(command.BotPerms || [])){
            embed.setTitle(`**Permissions**`)
            embed.setDescription(`Bot need: \`${command.BotPerms || []}\``)
            return interaction.reply({embeds: [embed]}).catch(err => console.log(err))
        }
        if (command.inVoice && !interaction.member.voice.channel) {
            embed.setTitle(`**Voice**`)
            embed.setDescription(`**・Bạn phải vào kênh thoại trước để dùng lệnh này**`)
            return interaction.reply({
                embeds: [embed]
            })
        }

        if (command.supportGuildOnly && (interaction.guild.id !== '1013647246769795102')) {
            embed.setTitle(`**Guild**`)
            embed.setDescription(`**・Lệnh này chỉ dùng cho máy chủ đặc biệt**`)
            return interaction.reply({
                embeds: [embed]
            })
        }
        
        command.run(client, interaction, args)
    }
}