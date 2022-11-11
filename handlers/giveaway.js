const { GiveawaysManager } = require("discord-giveaways");
const Discord = require("discord.js")
module.exports = (yourauth) => {
    yourauth.giveawaysManager = new GiveawaysManager(yourauth, {
        storage: "./storage/giveaways/giveaways.json",
        default: {
            botsCanWin: false,
            embedColor: "#2F3136",
            reaction: "🎉",
            lastChance: {
                enabled: true,
                content: `🛑 **Last chance to enter** 🛑`,
                threshold: 5000,
                embedColor: '#FF0000'
            }
        }
    });
    yourauth.giveawaysManager
        .on("endedGiveawayReactionAdded", (giveaway, member, reaction) => {
            reaction.users.remove(member.user);
            member.send(`**Aw snap! Looks Like that giveaway has already ended!**`).catch(e => { })
        })

        .on("giveawayEnded", async (giveaway, winners) => {
            winners.forEach((member) => {
                member.send({
                    embeds: [new Discord.EmbedBuilder()
                        .setTitle(`🎁 Let's goo!`)
                        .setColor("#2F3136")
                        .setDescription(`Hello there ${member.user}\n I heard that you have won **[[This Giveaway]](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})**\n Good Job On Winning **${giveaway.prize}!**\nDirect Message the host to claim your prize!!`)
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
                .setColor("#2F3136")
                .setTitle("Entry Approved! | You have a chance to win!!")
                .setDescription(
                    `Your entry to [This Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) has been approved!`
                )
                // .setFooter({ text: "Subscribe to ZeroSync on YT!" })
                .setTimestamp()
            let denied = new Discord.EmbedBuilder()
                .setTimestamp()
                .setColor("#2F3136")
                .setTitle(":x: Entry Denied | Databse Entry Not Found & Returned!")
                .setDescription(
                    `Your entry to [This Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) has been denied, please review the requirements to the giveaway properly.`
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
                    .setTitle('❓ Hold Up Did You Just Remove a Reaction From A Giveaway?')
                    .setColor("#2F3136")
                    .setDescription(
                        `Your entery to [This Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) was recorded but you un-reacted, since you don't need **${giveaway.prize}** I would have to choose someone else 😭`
                    )
                    .setFooter({ text: "Think It was a mistake? Go react again!" })
                ]
            }).catch(e => { })
        })
        .on("giveawayRerolled", async (giveaway, winners) => {
            winners.forEach((member) => {
                member.send({
                    embeds: [new Discord.EmbedBuilder()
                        .setTitle(`🎁 Let's goo! We Have A New Winner`)
                        .setColor("#2F3136")
                        .setDescription(`Hello there ${member.user}\n I heard that the host rerolled and you have won **[[This Giveaway]](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})**\n Good Job On Winning **${giveaway.prize}!**\nDirect Message the host to claim your prize!!`)
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