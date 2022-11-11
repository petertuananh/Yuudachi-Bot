
const Discord = require("discord.js")
const spotify = require("@ksolo/spotify-search");

module.exports = {
    name: 'play',
    description: 'Play a song.',
    usage: '<song name>',
    inVoice: true,
    voterOnly: true,
    options: [
        {
            name: 'target',
            description: 'Tên hoặc link bài hát',
            type: Discord.ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'type',
            description: 'Tìm theo kiểu',
            type: Discord.ApplicationCommandOptionType.String,
            required: false,
            choices : [
                {
                    "name": "song",
                    "value": "song"
                },
                {
                    "name": "playlist",
                    "value": "playlist"
                },
            ]
        }
    ],
    run: async (client, interaction, args) => {
        const string = interaction.options.getString('name_url')
        const type = interaction.options.getString('type')
        const clientID = "a18710974d294179ae5855291f81ed2f";
        const secretKey = "8b30d26e7be34d008fb94e90a506dc82";
        spotify.setCredentials(clientID, secretKey);
        const res = await spotify.search(string)
        const voiceChannel = interaction.member.voice.channel
        await interaction.reply({ content : `> Đang tìm, vui lòng chờ.....`, ephemeral : true})
        if (type == 'song' || !type) {
            // console.log(res.tracks.items)
            return interaction.editReply(`> \`✅\` Hiện tớ chưa hỗ trợ \`phát nhạc\`!`)
        } else if (type == 'playlist') {
            // res.tracks.items.forEach(r=>{
            //     client.distube.play(voiceChannel, r.external_urls.spotify, {
            //         textChannel: interaction.channel,
            //         member: interaction.member
            //     })
            // })
            return interaction.editReply(`> \`✅\` Hiện tớ chưa hỗ trợ \`playlist\`!`)
        }
        // await client.distube.play(voiceChannel, res.tracks.items.external_urls.spotify, {
        //     textChannel: interaction.channel,
        //     member: interaction.member
        // })

        return interaction.editReply(`> \`✅\` Successfully!`)
    }
}