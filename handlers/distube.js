const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
// const { YtDlpPlugin } = require("@distube/yt-dlp")
const Discord = require("discord.js")
const Format = Intl.NumberFormat();
let spotifyoptions = {
    parallel: true,
    emitEventsAfterFetching: false
};

module.exports = (client) => {
    client.distube = new DisTube(client, {
        leaveOnStop: false,
        leaveOnEmpty: true,
        emitNewSongOnly: true,
        emitAddSongWhenCreatingQueue: false,
        emitAddListWhenCreatingQueue: true,
        // youtubeCookie: `${client.config.api.youtubeAPI}`,
        // youtubeDL: false,
        plugins: [
            // new YtDlpPlugin({ update: false }),
            new SpotifyPlugin(spotifyoptions),
            new SoundCloudPlugin(),
        ]
    })
    // if(config.spotifyapi.enabled) {
    //     spotifyoptions.api = {
    //         clientId: client.user.id,
    //         clientSecret: client.config.discord.secret,
    //     }
    // }
    const volume = 50;

    const status = queue => `Volume: \`${queue.volume + volume}%\` | Repeat: \`${queue.repeatMode ? (queue.repeatMode === 2 ? 'Playlist' : 'Songs') : 'Off'
        }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``

    client.distube.on('addSong', async (queue, song) => {
        const msg = await queue.textChannel.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(`AQUA`)
                    .setAuthor({ name: 'Add Songs', iconURL: 'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/logo.gif' })
                    .setDescription(`[${song.name}](${song.url})`)
                    .setThumbnail(song.thumbnail)
                    .addField("Status", `${status(queue).toString()}`, false)
                    .addField('Views', `${Format.format(song.views)}`, true)
                    .addField('Like', `${Format.format(song.dislikes)}`, true)
                    .addField('Duration:', `${song.formattedDuration}`, true)
                    .addField("Requested By:", `${song.user}`, true)
            ]
        })
        return msg.react(`✅`)
    })

    client.distube.on('addList', async (queue, playlist) => {
        const embed = new Discord.EmbedBuilder()
            .setColor(`AQUA`)
            .setAuthor({ name: 'Adding playlist', iconURL: 'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/logo.gif' })
            .setDescription(`${playlist.user} Add [${playlist.name}](${playlist.url}) (${playlist.songs.length} bài hát) vào danh sách phát`)
            .setThumbnail(playlist.thumbnail)
            .addField("Status:", `${status(queue).toString()}`, false)
            .addField('Duration:', `${playlist.formattedDuration}`, true)
            .addField("Requested by:", `${playlist.user}`, true)
        const msg = await queue.textChannel.send({ embeds: [embed] })
        return msg.react(`➕`)
    })
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
    client.distube
        .on('playSong', async (queue, song) => {
            let downloader
            if (song.streamURL.length < 1024) {
                downloader = song.streamURL
            } else {
                downloader = null
            }
            const embed = new Discord.EmbedBuilder()
                .setColor(`AQUA`)
                .setAuthor({ name: 'Now playing', iconURL: 'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/logo.gif' })
                .setDescription(`[${song.name}](${song.url})`)
                .setThumbnail(song.thumbnail)
                .addFields(
                    { name: 'Status:', value: `${status(queue).toString()}`, inline: false },
                    { name: 'Posted by:', value: `[${song.uploader.name}](${song.uploader.url})`, inline: true },
                    { name: 'Views:', value: `${Format.format(song.views)}`, inline: true },
                    { name: 'Like:', value: `${Format.format(song.likes)}`, inline: true },
                    { name: 'Duration:', value: `${song.formattedDuration}`, inline: true },
                    { name: 'Downloaded:', value: `[Click here to download the song](${downloader}})`, inline: true },
                    { name: 'Requested By:', value: `${song.user}`, inline: true },
                    { name: 'Play music at:', value: `┕${client.channels.cache.get(queue.voiceChannel.id)}┕${queue.voiceChannel.bitrate / 1000}  kbps`, inline: false },

                )
            const msg = await queue.textChannel.send({ embeds: [embed], components : [row, row2] })

            return msg.react(`✅`)
        })
        .on('error', async (channel, e) => {
            channel.send(`| An error encountered: ${e.toString().slice(0, 1974)}`)
            console.error(e)
        })
        .on('empty', async channel => {
            const embed = new Discord.EmbedBuilder()
                .setColor(`AQUA`)
                .setAuthor({ name: 'Over', iconURL: 'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/logo.gif' })
                .setDescription('End of songs in the list')
            const msg = await channel.send({ embeds: [embed] })
            return msg.react(`❌`)
        })
        .on('searchNoResult', async (message, query) => {
            const embed = new Discord.EmbedBuilder()
                .setColor(`AQUA`)
                .setAuthor({ name: 'Not found', iconURL: 'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/logo.gif' })
                .setDescription(`No song found with keyword \`${query}\``)
            const msg = await message.channel.send({ embeds: [embed] })
            return msg.react(`❌`)
        })
        .on('finish', async queue => {
            const embed = new Discord.EmbedBuilder()
                .setColor(`AQUA`)
                .setAuthor({ name: 'End', iconURL: 'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/logo.gif' })
                .setDescription('End of songs in the list')
            const msg = await queue.textChannel.send({ embeds: [embed] })
            return msg.react(`❌`)
        })
}