const { GiveawaysManager } = require("discord-giveaways");
const Discord = require("discord.js")
module.exports = (yourauth) => {
    yourauth.giveawaysManager = new GiveawaysManager(yourauth, {
        storage: "./storage/giveaways/giveaways.json",
        default: {
            botsCanWin: false,
            embedColor: "Aqua",
            reaction: "<a:giveaways:964048599107387412>",
            lastChance: {
                enabled: true,
                content: `🛑 **Cơ hội cuối cùng cho cậu** 🛑`,
                threshold: 5000,
                embedColor: 'Aqua'
            }
        }
    });
    yourauth.giveawaysManager
        .on("endedGiveawayReactionAdded", (giveaway, member, reaction) => {
            reaction.users.remove(member.user);
            member.send(`**Giveaway này đã kết thúc trước đó rồi! xD**`).catch(e => { })
        })

        .on("giveawayEnded", async (giveaway, winners) => {
            winners.forEach((member) => {
                member.send({
                    embeds: [new Discord.EmbedBuilder()
                        .setTitle(`Thắng giveaway`)
                        .setColor("Aqua")
                        .setDescription(`Êy biết tin gì chưa, cậu đã thắng **[giveaway này](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) rồi**\n Nếu tớ nghe không nhầm, **${giveaway.prize}** là phần thưởng của cậu`)
                        .setTimestamp()
                        .setFooter({
                            text: `${member.user.username}`,
                            iconURL: member.user.displayAvatarURL()
                        })
                    ]
                }).catch(e => { })
            });
        })
        .on("giveawayReactionAdded", async (giveaway, reactor, messageReaction) => {
            let approved = new Discord.EmbedBuilder()
                .setTimestamp()
                .setColor("Aqua")
                .setTitle("Oke cậu, tớ đã nhận được yêu cầu tham gia giveaway của cậu!")
                .setDescription(
                    `> Di chuyển đến [giveaway này](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})!`
                )
                // .setFooter({ text: "Subscribe to ZeroSync on YT!" })
                .setTimestamp()
            let denied = new Discord.EmbedBuilder()
                .setTimestamp()
                .setColor("Aqua")
                .setTitle(`❌, cậu chưa có các yêu cầu cần thiết của host để tham gia giveaway!`)
                .setDescription(
                    `> Di chuyển đến [This Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) has been denied, please review the requirements to the giveaway properly.`
                )
                // .setFooter({ text: "Subscribe to ZeroSync on YT!" })

            let client = messageReaction.message.client
            if (reactor.user.bot) return;
            if (giveaway.extraData) {
                if (giveaway.extraData.server !== "null") {
                    try {
                        await client.guilds.cache.get(giveaway.extraData.server).members.fetch(reactor.id)
                        return reactor.send({
                            embeds: [approved]
                        });
                    } catch (e) {
                        messageReaction.users.remove(reactor.user);
                        return reactor.send({
                            embeds: [denied]
                        }).catch(e => { })
                    }
                }
                if (giveaway.extraData.role !== "null" && !reactor.roles.cache.get(giveaway.extraData.role)) {
                    messageReaction.users.remove(reactor.user);
                    return reactor.send({
                        embeds: [denied]
                    }).catch(e => { })
                }

                return reactor.send({
                    embeds: [approved]
                }).catch(e => { })
            } else {
                return reactor.send({
                    embeds: [approved]
                }).catch(e => { })
            }
        })
        .on("giveawayReactionRemoved", async (giveaway, member) => {
            return member.send({
                embeds: [new Discord.EmbedBuilder()
                    .setTimestamp()
                    .setTitle('Ơ kìa, cậu không tham gia giveaway nữa à?')
                    .setColor("Aqua")
                    .setDescription(
                        `> Di chuyển đến [giveaway này](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})`
                    )
                    .setFooter({ text: "Nếu cậu nghĩ đây là nhầm lẫn, hãy tham gia lại!" })
                ]
            }).catch(e => { })
        })
        .on("giveawayRerolled", async (giveaway, winners) => {
            winners.forEach((member) => {
                member.send({
                    embeds: [new Discord.EmbedBuilder()
                        .setTitle(`🎁 Let's go!`)
                        .setColor("Aqua")
                        .setDescription(`Êy ${member.user}\n Trời ơi in được không, cậu thắng **[[giveaway này]](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) rồi**\n Nếu tớ nghe không nhầm, cậu sẽ nhận được **${giveaway.prize}!**\nNhanh chóng DMs cho host để nhận thưởng đi ha!!`)
                        .setTimestamp()
                        .setFooter({
                            text: `${member.user.username}`,
                            iconURL: member.user.displayAvatarURL()
                        })
                    ]
                }).catch(e => { })
            });
        })
}