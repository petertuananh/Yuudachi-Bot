const Discord = require("discord.js");
const Tesseract = require("tesseract.js")
const fetchAll = require('discord-fetch-all');
const fs = require("fs")
const https = require("https")
const path = require('path')
const getColors = require('get-image-colors')

module.exports = {
    name: "check",
    description: "Check để lấy role vjp",
    options: [
        {
            name: "image",
            description: "Tải ảnh lên",
            type: Discord.ApplicationCommandOptionType.Attachment,
            required: true,
        },
    ],
    category: "Custom",
    cooldown: 5,
    ownerOnly: false,
    supportGuildOnly: true,
    // UserPerms: ["KickMembers"],
    // BotPerms: ["KickMembers"],
    run: async (client, interaction, args) => {
        const attachment = interaction.options.getAttachment("image")
        await interaction.reply(`> Đang kiểm tra profile...`)
        const acceptedColor = ["#080404", "#04040c", "#222223", "#202121", "#fcfcfc", "#fcf4fc", "#1e1f1f", "#dededf", "#049cd9", "277ea3", "#717172", "#1c1d1e", "#dededf"]
        Tesseract.recognize(`${attachment.url}`, 'eng', {
            logger: m => {

            }
        })
            .then(async ({ data: { text } }) => {
                console.log(text)
                if (!text.includes(`${interaction.member.user.tag}`) || !text.includes(`mayduahuongnoi`)) {
                    // console.log(1)
                    // console.log(interaction.member.user.tag)
                    return interaction.editReply({
                        embeds: [
                            new Discord.EmbedBuilder()
                                .setColor("Aqua")
                                .setDescription(`> \`❌\` Tớ không thể thực hiện yêu cầu của bạn!\n> Hãy chắc chắn rằng bạn đã\n\`\`\`> Thêm https://discord.gg/mayduahuongnoi vào bio\n> Đặt tên người dùng có chứa: MĐHN\n> Chụp toàn phần profile (như hình dưới)\`\`\``)
                                .setImage(`https://cdn.discordapp.com/attachments/934334762506666045/1040938934840086568/image.png`)
                        ],
                        content: ``,
                        ephemeral: false,
                    })
                } else if (!interaction.member.user.username.includes("MDHN") && !interaction.member.user.username.includes("MĐHN")) {
                    // console.log(2)
                    return interaction.editReply({
                        embeds: [
                            new Discord.EmbedBuilder()
                                .setColor("Aqua")
                                .setDescription(`> \`❌\` Tớ không thể thực hiện yêu cầu của bạn!\n> Hãy chắc chắn rằng bạn đã\n\`\`\`> Thêm https://discord.gg/mayduahuongnoi vào bio\n> Đặt tên người dùng có chứa: MĐHN\n> Chụp toàn phần profile (như hình dưới)\`\`\``)
                                .setImage(`https://cdn.discordapp.com/attachments/934334762506666045/1040938934840086568/image.png`)
                        ],
                        content: ``,
                        ephemeral: false,
                    })
                } else {
                    await interaction.member.roles.add("1040844608386646126").catch(() => { })
                    return interaction.editReply({ content: `> \`✅\` Xác minh thành công, bạn đã nhận được role <@&1040844608386646126>`, allowedMentions: { parse: [] } })
                }

            })
        // getColors(`${attachment.url}`).then(colors => {
        //     colors.forEach(async color => {
        //         console.log(color.hex())
        //         if (!acceptedColor.includes(color.hex())) {
        //             console.log(0)
        //             return interaction.editReply({
        //                 embeds: [
        //                     new Discord.EmbedBuilder()
        //                         .setColor("Aqua")
        //                         .setDescription(`> \`❌\` Tớ không thể thực hiện yêu cầu của bạn!\n> Hãy chắc chắn rằng bạn đã\n\`\`\`> Thêm https://discord.gg/mayduahuongnoi vào bio\n> Đặt tên người dùng có chứa: MĐHN\n> Chụp toàn phần profile (như hình dưới)\`\`\``)
        //                         .setImage(`https://cdn.discordapp.com/attachments/934334762506666045/1040938934840086568/image.png`)
        //                 ],
        //                 content: ``,
        //                 ephemeral: false,
        //             })
                    
        //         } else {
        //             Tesseract.recognize(`${attachment.url}`, 'vie', {
        //                 logger: m => {

        //                 }
        //             })
        //                 .then(async ({ data: { text } }) => {
        //                     console.log(text)
        //                     if (!text.includes(`${interaction.member.user.tag}`) || !text.includes(`mayduahuongnoi`)) {
        //                         console.log(1)
        //                         console.log(interaction.member.user.tag)
        //                         return interaction.editReply({
        //                             embeds: [
        //                                 new Discord.EmbedBuilder()
        //                                     .setColor("Aqua")
        //                                     .setDescription(`> \`❌\` Tớ không thể thực hiện yêu cầu của bạn!\n> Hãy chắc chắn rằng bạn đã\n\`\`\`> Thêm https://discord.gg/mayduahuongnoi vào bio\n> Đặt tên người dùng có chứa: MĐHN\n> Chụp toàn phần profile (như hình dưới)\`\`\``)
        //                                     .setImage(`https://cdn.discordapp.com/attachments/934334762506666045/1040938934840086568/image.png`)
        //                             ],
        //                             content: ``,
        //                             ephemeral: false,
        //                         })
        //                     } else if (!interaction.member.user.username.includes("MDHN") && !interaction.member.user.username.includes("MĐHN")) {
        //                         console.log(2)
        //                         return interaction.editReply({
        //                             embeds: [
        //                                 new Discord.EmbedBuilder()
        //                                     .setColor("Aqua")
        //                                     .setDescription(`> \`❌\` Tớ không thể thực hiện yêu cầu của bạn!\n> Hãy chắc chắn rằng bạn đã\n\`\`\`> Thêm https://discord.gg/mayduahuongnoi vào bio\n> Đặt tên người dùng có chứa: MĐHN\n> Chụp toàn phần profile (như hình dưới)\`\`\``)
        //                                     .setImage(`https://cdn.discordapp.com/attachments/934334762506666045/1040938934840086568/image.png`)
        //                             ],
        //                             content: ``,
        //                             ephemeral: false,
        //                         })
        //                     } else {
        //                         await interaction.member.roles.add("1040844608386646126").catch(() => { })
        //                         // const messages = []
        //                         // let msges = {}
        //                         // interaction.guild.channels.cache.forEach(async channel => {
        //                         //     if (channel.type !== 0) return;
        //                         //     const allMessages = await fetchAll.messages(channel, {
        //                         //         reverseArray: true,
        //                         //         userOnly: true,
        //                         //         botOnly: false,
        //                         //         pinnedOnly: false,
        //                         //     });
        //                         //     const a = await allMessages.filter((m) => m.author.id == interaction.member.id).length
        //                         //     msges = msges || 0 + a
        //                         //     messages.push(a)
        //                         // })
        //                         // setTimeout(() => {
        //                         //     const xD = messages.reduce((partialSum, a) => partialSum + a, 0)
        //                         //     console.log(xD)
        //                         // }, 20000)
        //                         return interaction.editReply({ content: `> \`✅\` Xác minh thành công, bạn đã nhận được role <@&1040844608386646126>`, allowedMentions: { parse: [] } })
        //                     }

        //                 })
        //         }
        //         if (acceptedColor.includes(color.hex())) return true
        //     })
        // })
    }
}