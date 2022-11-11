const Discord = require("discord.js")
const ms = require("ms")

const messages = {
    giveaway:
        "" +
        "🎉 **GIVEAWAY** 🎉",
    giveawayEnded:
        "" +
        "🎉 **GIVEAWAY ENDED** 🎉",
    drawing: `Ends: **{timestamp}**`,
    inviteToParticipate: `React with 🎉 to participate!`,
    winMessage: "Congratulations, {winners}! You won **{this.prize}**!",
    embedFooter: "Giveaways",
    noWinner: "Giveaway cancelled, no valid participations.",
    hostedBy: "Hosted by: {this.hostedBy}",
    winners: "winner(s)",
    endedAt: "Ended at"
}

module.exports = {
    name: "giveaway",
    description: "Giveaways 🎉🎉🎉",
    ownerOnly: false,
    UserPerms: ["ManageGuild"] || ["ManageEvents"],
    voterOnly: true,
    options: [
        {
            name: "start",
            description: "🎉 Start a giveaway",
            type: 1,
            options: [
                {
                    name: 'duration',
                    description: 'How long the giveaway should last for. Example values: 1m, 1h, 1d',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: 'winners',
                    description: 'How many winners the giveaway should have',
                    type: Discord.ApplicationCommandOptionType.Integer,
                    required: true
                },
                {
                    name: 'prize',
                    description: 'What the prize of the giveaway should be',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: 'channel',
                    description: 'The channel to start the giveaway in',
                    type: Discord.ApplicationCommandOptionType.Channel,
                    required: true
                },
                {
                    name: 'bonusrole',
                    description: 'Role which would recieve bonus entries',
                    type: Discord.ApplicationCommandOptionType.Role,
                    required: false
                },
                {
                    name: 'bonusamount',
                    description: 'The amount of bonus entries the role will recieve',
                    type: Discord.ApplicationCommandOptionType.Integer,
                    required: false
                },
                {
                    name: 'invite',
                    description: 'Invite of the server you want to add as giveaway joining requirement',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: false
                },
                {
                    name: 'role',
                    description: 'Role you want to add as giveaway joining requirement',
                    type: Discord.ApplicationCommandOptionType.Role,
                    required: false
                },
            ],
        },
        {
            name: "end",
            description: "🎉 End an already running giveaway",
            type: 1,
            options: [
                {
                    name: 'giveaway',
                    description: 'The giveaway to end (message ID or giveaway prize)',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true
                }
            ],
        },
        {
            name: "reroll",
            description: "🎉 Reroll a giveaway",
            type: 1,
            options: [
                {
                    name: 'giveaway',
                    description: 'The giveaway to reroll (message ID or prize)',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true
                }
            ],
        },
        {
            name: "edit",
            description: "🎉 Edit a giveaway",
            type: 1,
            options: [
                {
                    name: 'giveaway',
                    description: 'The giveaway to end (message ID)',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: 'duration',
                    description: 'Setting time of mentioned giveaway. Eg. 1h sets the current giveaway to end after an hour!',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: 'winners',
                    description: 'How many winners the giveaway should have',
                    type: Discord.ApplicationCommandOptionType.Integer,
                    required: true
                },
                {
                    name: 'prize',
                    description: 'What the prize of the giveaway should be',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true
                }
            ],
        },
        {
            name: "pause",
            description: "⏸ Pause a giveaway",
            type: 1,
            options: [
                {
                    name: 'giveaway',
                    description: 'The giveaway to pause (message ID or giveaway prize)',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true
                }
            ],
        },
        {
            name: "resume",
            description: "▶ Resume a paused giveaway",
            type: 1,
            options: [
                {
                    name: 'giveaway',
                    description: 'The giveaway to resume (message ID or giveaway prize)',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true
                }
            ],
        },
        {
            name: "list",
            description: "🎉 List all the active giveaways for this guild",
            type: 1,
        },
    ],
    run: async (client, interaction) => {
        const choice = interaction.options.getSubcommand()
        if (choice == 'start') {
            const giveawayChannel = interaction.options.getChannel('channel');
            const giveawayDuration = interaction.options.getString('duration');
            const giveawayWinnerCount = interaction.options.getInteger('winners');
            const giveawayPrize = interaction.options.getString('prize');
            if (giveawayChannel.type !== 0) {
                return interaction.reply({
                    content: ':x: Please select a text channel!',
                    ephemeral: true
                });
            }
            if (isNaN(ms(giveawayDuration))) {
                return interaction.reply({
                    content: ':x: Please select a valid duration!',
                    ephemeral: true
                });
            }
            if (giveawayWinnerCount < 1) {
                return interaction.reply({
                    content: ':x: Please select a valid winner count! greater or equal to one.',
                })
            }

            const bonusRole = interaction.options.getRole('bonusrole')
            const bonusEntries = interaction.options.getInteger('bonusamount')
            let rolereq = interaction.options.getRole('role')
            let invite = interaction.options.getString('invite')

            if (bonusRole) {
                if (!bonusEntries) {
                    return interaction.reply({
                        content: `:x: You must specify how many bonus entries would ${bonusRole} recieve!`,
                        ephemeral: true
                    });
                }
            }


            await interaction.deferReply({ ephemeral: true })
            let reqinvite;
            if (invite) {
                let invitex = await client.fetchInvite(invite)
                let client_is_in_server = client.guilds.cache.get(
                    invitex.guild.id
                )
                reqinvite = invitex
                if (!client_is_in_server) {
                    return interaction.editReply({
                        embeds: [{
                            color: "#2F3136",
                            author: {
                                name: client.user.username,
                                iconURL: client.user.displayAvatarURL()
                            },
                            title: "Server Check!",
                            // url: "https://youtube.com/c/ZeroSync",
                            description:
                                "Woah woah woah! I see a new server! are you sure I am in that? You need to invite me there to set that as a requirement! 😳",
                            timestamp: new Date(),
                            footer: {
                                iconURL: client.user.displayAvatarURL(),
                                text: "Server Check"
                            }
                        }]
                    })
                }
            }

            if (rolereq && !invite) {
                messages.inviteToParticipate = `**React with 🎉 to participate!**\n>>> - Only members having ${rolereq} are allowed to participate in this giveaway!`
            }
            if (rolereq && invite) {
                messages.inviteToParticipate = `**React with 🎉 to participate!**\n>>> - Only members having ${rolereq} are allowed to participate in this giveaway!\n- Members are required to join [this server](${invite}) to participate in this giveaway!`
            }
            if (!rolereq && invite) {
                messages.inviteToParticipate = `**React with 🎉 to participate!**\n>>> - Members are required to join [this server](${invite}) to participate in this giveaway!`
            }


            // start giveaway
            client.giveawaysManager.start(giveawayChannel, {
                // The giveaway duration
                duration: ms(giveawayDuration),
                // The giveaway prize
                prize: giveawayPrize,
                // The giveaway winner count
                winnerCount: parseInt(giveawayWinnerCount),
                // BonusEntries If Provided
                bonusEntries: [
                    {
                        // Members who have the role which is assigned to "rolename" get the amount of bonus entries which are assigned to "BonusEntries"
                        bonus: new Function('member', `return member.roles.cache.some((r) => r.name === \'${bonusRole?.name}\') ? ${bonusEntries} : null`),
                        cumulative: false
                    }
                ],
                // Messages
                messages,
                extraData: {
                    server: reqinvite == null ? "null" : reqinvite.guild.id,
                    role: rolereq == null ? "null" : rolereq.id,
                }
            });
            interaction.editReply({
                content:
                    `Giveaway started in ${giveawayChannel}!`,
                ephemeral: true
            })

            if (bonusRole) {
                let giveaway = new Discord.EmbedBuilder()
                    .setAuthor({ name: `Bonus Entries Alert!` })
                    .setDescription(
                        `**${bonusRole}** Has **${bonusEntries}** Extra Entries in this giveaway!`
                    )
                    .setColor("#2F3136")
                    .setTimestamp();
                giveawayChannel.send({ embeds: [giveaway] });
            }
        } else if (choice == 'end') {
            const query = interaction.options.getString('giveaway');

            // fetching the giveaway with message Id or prize
            const giveaway =
                // Search with giveaway prize
                client.giveawaysManager.giveaways.find((g) => g.prize === query && g.guildId === interaction.guild.id) ||
                // Search with giveaway Id
                client.giveawaysManager.giveaways.find((g) => g.messageId === query && g.guildId === interaction.guild.id);

            // If no giveaway was found with the corresponding input
            if (!giveaway) {
                return interaction.reply({
                    content: 'Unable to find a giveaway for `' + query + '`.',
                    ephemeral: true
                });
            }

            if (giveaway.ended) {
                return interaction.reply({
                    content: 'This giveaway has already ended!',
                    ephemeral: true
                });
            }

            // Edit the giveaway
            client.giveawaysManager.end(giveaway.messageId)
                // Success message
                .then(() => {
                    // Success message
                    interaction.reply(`**[This Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})** Has Now Ended!`);
                })
                .catch((e) => {
                    interaction.reply({
                        content: e,
                        ephemeral: true
                    });
                });
        } else if (choice == 'reroll') {
            const query = interaction.options.getString('giveaway');

            // try to find the giveaway with the provided prize OR with the ID
            const giveaway =
                // Search with giveaway prize
                client.giveawaysManager.giveaways.find((g) => g.prize === query && g.guildId === interaction.guild.id) ||
                // Search with giveaway ID
                client.giveawaysManager.giveaways.find((g) => g.messageId === query && g.guildId === interaction.guild.id);

            // If no giveaway was found
            if (!giveaway) {
                return interaction.reply({
                    content: 'Unable to find a giveaway for `' + query + '`.',
                    ephemeral: true
                });
            }

            if (!giveaway.ended) {
                return interaction.reply({
                    content: `[This Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) has not been ended yet`,
                    ephemeral: true
                });
            }

            // Reroll the giveaway
            client.giveawaysManager.reroll(giveaway.messageId)
                .then(() => {
                    // Success message
                    interaction.reply(`Rerolled **[this giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})!**`);
                })
                .catch((e) => {
                    interaction.reply({
                        content: e,
                        ephemeral: true
                    });
                });
        } else if (choice == 'edit') {
            const gid = interaction.options.getString('giveaway');
            const time = interaction.options.getString('duration');
            const winnersCount = interaction.options.getInteger('winners');
            const prize = interaction.options.getString('prize');

            await interaction.deferReply({
                ephemeral: true
            })
            // Edit the giveaway
            try {
                await client.giveawaysManager.edit(gid, {
                    newWinnersCount: winnersCount,
                    newPrize: prize,
                    addTime: time
                })
            } catch (e) {
                return interaction.editReply({
                    content:
                        `No giveaway found with the given message ID: \`${gid}\``,
                    ephemeral: true
                });
            }
            interaction.editReply({
                content:
                    `This giveaway has now been edited!`,
                ephemeral: true
            });
        } else if (choice == 'pause') {
            const query = interaction.options.getString('giveaway');

            // try to find the giveaway with prize alternatively with ID
            const giveaway =
                // Search with giveaway prize
                client.giveawaysManager.giveaways.find((g) => g.prize === query && g.guildId === interaction.guild.id) ||
                // Search with giveaway ID
                client.giveawaysManager.giveaways.find((g) => g.messageId === query && g.guildId === interaction.guild.id);

            // If no giveaway was found
            if (!giveaway) {
                return interaction.reply({
                    content: 'Unable to find a giveaway for `' + query + '`.',
                    ephemeral: true
                });
            }

            if (giveaway.pauseOptions.isPaused) {
                return interaction.reply({
                    content: `**[This giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})**  is already paused.`,
                    ephemeral: true
                });
            }

            // Edit the giveaway
            client.giveawaysManager.pause(giveaway.messageId)
                // Success message
                .then(() => {
                    // Success message
                    interaction.reply(`**[This giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})** has now been paused!`);
                })
                .catch((e) => {
                    interaction.reply({
                        content: e,
                        ephemeral: true
                    });
                });
        } else if (choice == 'resume') {
            const query = interaction.options.getString('giveaway');

            // try to find the giveaway with prize alternatively with ID
            const giveaway =
                // Search with giveaway prize
                client.giveawaysManager.giveaways.find((g) => g.prize === query && g.guildId === interaction.guild.id) ||
                // Search with giveaway ID
                client.giveawaysManager.giveaways.find((g) => g.messageId === query && g.guildId === interaction.guild.id);

            // If no giveaway was found
            if (!giveaway) {
                return interaction.reply({
                    content: 'Unable to find a giveaway for `' + query + '`.',
                    ephemeral: true
                });
            }

            if (!giveaway.pauseOptions.isPaused) {
                return interaction.reply({
                    content: `**[This giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})**  is not paused!`,
                    ephemeral: true
                });
            }

            // Edit the giveaway
            client.giveawaysManager.unpause(giveaway.messageId)
                // Success message
                .then(() => {
                    // Success message
                    interaction.reply(`**[This giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})** has been successfully resumed!`);
                })
                .catch((e) => {
                    interaction.reply({
                        content: e,
                        ephemeral: true
                    });
                });
        } else if (choice == 'list') {
            const select = new Discord.MessageSelectMenu().setCustomId("select").setPlaceholder("Choose a type of giveaway to view!").addOptions([
                {
                    label: '🎉 Normal Giveaways',
                    description: 'Check the normal giveaways currently running in your server!',
                    value: 'normal',
                },
                {
                    label: "⚙ Guild Requirement Giveaways!",
                    description: "Check the giveaways running with a guild requirement!",
                    value: "guildReq"
                },
            ])
            const row = new Discord.MessageActionRow().addComponents([select])
            let giveaways = client.giveawaysManager.giveaways.filter(g => g.guildId === `${interaction.guild.id}` && !g.ended);
            if (!giveaways.some(e => e.messageId)) {
                return interaction.reply('💥 No Giveaways To Be Displayed')
            }
            const msg = await interaction.channel.send({ embeds: [new Discord.EmbedBuilder().setDescription("Choose an option in the select menu to get started!").setColor("#2F3136").setTimestamp()], components: [row] })
            let embed = new Discord.EmbedBuilder()
                .setTitle("Currently Active Giveaways")
                .setColor("#2F3136")
                .setFooter({
                    text: `Requested by ${interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setTimestamp()
            let embedGuild = new Discord.EmbedBuilder()
                .setTitle("Currently Active Join Requirement Giveaways")
                .setColor("#2F3136")
                .setFooter({
                    text: `Requested by ${interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setTimestamp()
            const filter = x => x.customId == "select" && x.user.id == interaction.member.id
            const collector = await interaction.channel.createMessageComponentCollector({ filter, time: 60000, max: 1 })
            await interaction.deferReply()
            collector.on("collect", async (i) => {
                const val = i.values[0]
                if (val == "normal") {
                    await Promise.all(giveaways.map(async (x) => {
                        embed.addField(`Normal Giveaway:`, `**Prize:** **[${x.prize}](https://discord.com/channels/${x.guildId}/${x.channelId}/${x.messageId})\nStarted:** <t:${((x.startAt) / 1000).toFixed(0)}:R> (<t:${((x.startAt) / 1000).toFixed(0)}:f>)\n**Ends:** <t:${((x.endAt) / 1000).toFixed(0)}:R> (<t:${((x.endAt) / 1000).toFixed(0)}:f>)`)
                    }));
                    msg.delete()
                    interaction.editReply({ embeds: [embed], components: [] })
                }
                if (val == "guildReq") {
                    if (val == "guildReq") {
                        if (!giveaways.some(e => e.extraData)) {
                            interaction.editReply({ content: '💥 No Giveaways To Be Displayed', embeds: [], components: [] })
                            msg.delete()
                            return
                        }
                    }
                    await Promise.all(giveaways.map(async (x) => {
                        if (x.extraData) {
                            const guild = client.guilds.cache.get(x.extraData.server)
                            const channel = guild.channels.cache
                                .filter((channel) => channel.type === 'text')
                                .first()
                            const inv = await channel.createInvite()
                            embedGuild.addField(`Join Requirement Giveaway:`, `**Prize:** **[${x.prize}](https://discord.com/channels/${x.guildId}/${x.channelId}/${x.messageId})**\n**Requirement: [This Server](${inv})**\n**Started:** <t:${((x.startAt) / 1000).toFixed(0)}:R> (<t:${((x.startAt) / 1000).toFixed(0)}:f>)\n**Ends:** <t:${((x.endAt) / 1000).toFixed(0)}:R> (<t:${((x.endAt) / 1000).toFixed(0)}:f>)`)
                        }
                    }));
                    msg.delete()
                    interaction.editReply({ embeds: [embedGuild], components: [] })

                }
            })
            collector.on("end", (collected, reason) => {
                if (reason == "time") {
                    interaction.editReply({ content: "👀 Collector Destroyed, Try Again!", components: [] })
                }
            })
        }
    }
}