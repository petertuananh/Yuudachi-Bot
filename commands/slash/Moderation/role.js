const Discord = require("discord.js")
const ascii = require('ascii-table');
module.exports = {
    name: "role",
    description: "Role commands",
    ownerOnly: false,
    UserPerms: ["ManageRoles"],
    voterOnly: true,
    options: [
        {
            name: "add",
            description: "Add a role to a user",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "user",
                    description: "Specify a user",
                    type: Discord.ApplicationCommandOptionType.User,
                    required: true,
                },
                {
                    name: "role",
                    description: "Specify a role",
                    type: Discord.ApplicationCommandOptionType.Role,
                    required: true,
                },
            ]
        },
        {
            name: "remove",
            description: "Remove a role from a user",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "user",
                    description: "Specify a user",
                    type: Discord.ApplicationCommandOptionType.User,
                    required: true,
                },
                {
                    name: "role",
                    description: "Specify a role",
                    type: Discord.ApplicationCommandOptionType.Role,
                    required: true,
                },
            ]
        },
        {
            name: "create",
            description: "Create a role",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "name",
                    description: "Specify a name",
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true,
                },
            ]
        },
        {
            name: "delete",
            description: "Delete a role",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "role",
                    description: "Specify a role",
                    type: Discord.ApplicationCommandOptionType.Role,
                    required: true,
                },
            ]
        },
        {
            name: "hoist",
            description: "Hoist/unhoist a role",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "role",
                    description: "Specify a role",
                    type: Discord.ApplicationCommandOptionType.Role,
                    required: true,
                },
            ]
        },
        {
            name: "color",
            description: "Set color to role",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "color",
                    description: "Specify a color",
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: "role",
                    description: "Specify a role",
                    type: Discord.ApplicationCommandOptionType.Role,
                    required: true,
                },
            ]
        },
        {
            name: "rename",
            description: "Set the name to role",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "name",
                    description: "Specify a color",
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: "role",
                    description: "Specify a role",
                    type: Discord.ApplicationCommandOptionType.Role,
                    required: true,
                },
            ]
        },
        {
            name: "info",
            description: "Show role infomation",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "role",
                    description: "Specify a role",
                    type: Discord.ApplicationCommandOptionType.Role,
                    required: true,
                },
            ]
        },
        {
            name: "list",
            description: "Show all of server roles",
            type: Discord.ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "everyone",
            description: "Add/remove role to/from everyone",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    "name": "type",
                    "description": "Type",
                    type: Discord.ApplicationCommandOptionType.String,
                    "required": true,
                    "choices": [
                        {
                            "name": "add",
                            "value": "add"
                        },
                        {
                            "name": "remove",
                            "value": "remove"
                        },
                    ],
                },
                {
                    name: "role",
                    description: "Specify a role",
                    type: Discord.ApplicationCommandOptionType.Role,
                    required: true,
                },
            ]
        },
        {
            name: "bots",
            description: "Add/remove role to/from bots",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    "name": "type",
                    "description": "Type",
                    type: Discord.ApplicationCommandOptionType.String,
                    "required": true,
                    "choices": [
                        {
                            "name": "add",
                            "value": "add"
                        },
                        {
                            "name": "remove",
                            "value": "remove"
                        },
                    ],
                },
                {
                    name: "role",
                    description: "Specify a role",
                    type: Discord.ApplicationCommandOptionType.Role,
                    required: true,
                },
            ]
        },
        {
            name: "humans",
            description: "Add/remove role to/from humans",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    "name": "type",
                    "description": "Type",
                    type: Discord.ApplicationCommandOptionType.String,
                    "required": true,
                    "choices": [
                        {
                            "name": "add",
                            "value": "add"
                        },
                        {
                            "name": "remove",
                            "value": "remove"
                        },
                    ],
                },
                {
                    name: "role",
                    description: "Specify a role",
                    type: Discord.ApplicationCommandOptionType.Role,
                    required: true,
                },
            ]
        },
    ],
    run: async (client, interaction) => {
        const option = interaction.options.getSubcommand()
        const role = await interaction.options.getRole("role") ? await interaction.guild.roles.cache.get(interaction.options.getRole("role").id) : null
        const user = await interaction.options.getUser("user") ? await interaction.guild.members.fetch(interaction.options.getUser("user").id) : null
        const name = interaction.options.getString("name")
        const type = interaction.options.getString("type")
        const color = interaction.options.getString("color")
        const execulator = await interaction.guild.members.fetch(interaction.member.id)
        let members = await interaction.guild.members.fetch({ force: true });
        async function checkAuthorize() {
            if (interaction.guild.ownerId !== execulator.id && execulator.roles.highest.position <= role.position) {
                return interaction.reply({ content: `> \`❌\` Cậu không thể tác động lên vai trò này, vì nó cao hơn của cậu!`, ephemeral: true })
            } else if (role.tags) {
                if (role.tags.botId) {
                    return interaction.reply({ content: `> \`❌\` Cậu không thể tác động lên vai trò này, vì nó là vai trò mặc định của bot!`, ephemeral: true })
                } else if (role.tags.premiumSubscriberRole) {
                    return interaction.reply({ content: `> \`❌\` Cậu không thể tác động lên vai trò này, vì nó là vai trò mặc định cho booster!`, ephemeral: true })
                } else {
                    return true
                }
            } else {
                return true
            }
        }
        if (role && await checkAuthorize() !== true) return;
        if (option == 'add') {
            await user.roles.add(role.id, `Actioned by ${execulator.user.tag}`).catch(e => {
                return interaction.reply({ content: `> \`❌\` Ơ, lỗi gì đó rồi!`, ephemeral: true })
            })
            return interaction.reply({ content: `> \`✅\` Tớ đã thêm vai trò ${role} cho bạn ${user} rồi!`, ephemeral: true })
        } else if (option == 'remove') {
            await user.roles.remove(role.id, `Actioned by ${execulator.user.tag}`).catch(e => {
                return interaction.reply({ content: `> \`❌\` Ơ, lỗi gì đó rồi!`, ephemeral: true })
            })
            return interaction.reply({ content: `> \`✅\` Tớ đã bỏ vai trò ${role} từ bạn ${user} rồi!`, ephemeral: true })
        } else if (option == 'create') {
            const createdRole = await interaction.guild.roles.create({
                name: name,
                permissions: [],
            }, { reason: `Actioned by ${execulator.user.tag}` }).catch(e => {
                return interaction.reply({ content: `> \`❌\` Ơ, lỗi gì đó rồi!`, ephemeral: true })
            })
            return interaction.reply({ content: `> \`✅\` Đã tạo vai trò ${createdRole}!`, ephemeral: true })
        } else if (option == 'delete') {
            const name = role.name
            await role.delete(`Actioned by ${execulator.user.tag}`)
                .catch(e => {
                    return interaction.reply({ content: `> \`❌\` Ơ, lỗi gì đó rồi!`, ephemeral: true })
                })
            return interaction.reply({ content: `> \`✅\` Đã xóa vai trò \`${name}\`!`, ephemeral: true })
        } else if (option == 'hoist') {
            if (role.hoist) {
                await role.setHoist(false).catch(e => {
                    return interaction.reply({ content: `> \`❌\` Ơ, lỗi gì đó rồi!`, ephemeral: true })
                })
                return interaction.reply({ content: `> \`✅\` Đã tắt hiển thị riêng biệt vai trò ${role}!`, ephemeral: true })
            } else {
                await role.setHoist(true).catch(e => {
                    return interaction.reply({ content: `> \`❌\` Ơ, lỗi gì đó rồi!`, ephemeral: true })
                })
                return interaction.reply({ content: `> \`✅\` Đã bật hiển thị riêng biệt vai trò ${role}!`, ephemeral: true })
            }
        } else if (option == 'color') {
            await role.setColor(color).catch(e => {
                return interaction.reply({ content: `> \`❌\` Ơ, lỗi gì đó rồi!`, ephemeral: true })
            })
            return interaction.reply({ content: `> \`✅\` Đã thay đổi màu cho vai trò ${role}!`, ephemeral: true })
        } else if (option == 'rename') {
            await role.setName(name).catch(e => {
                return interaction.reply({ content: `> \`❌\` Ơ, lỗi gì đó rồi!`, ephemeral: true })
            })
            return interaction.reply({ content: `> \`✅\` Đã thay đổi tên cho vai trò ${role} thành \`${name}\`!`, ephemeral: true })
        } else if (option == 'info') {
            const embed = new Discord.MessageEmbed().setColor(role.color || 'AQUA')
                .setTitle(`Role Info: \`[  ${role.name}  ]\``)
                .addField("**❯ ID**", `\`${role.id}\``)
                .addField("**❯ Name**", role.name)
                .addField("**❯ Hex**", role.hexColor)
                .addField("**❯ Members**", role.members.size.toString())
                .addField("**❯ Position**", (parseInt(interaction.guild.roles.cache.size) - role.position).toString())
                .addField("**❯ Mentionable**", role.mentionable ? 'Yes' : 'No')
            return interaction.reply({ embeds: [embed], ephemeral: true })
        } else if (option == 'list') {
            // const listrole = await interaction.guild.roles.cache.map((r) => `${r.name}`)
            // .join('\n')
            if (interaction.guild.roles.cache.size > 50) return interaction.reply({ content: `> \`❌\` Quá nhiều vai trò để hiện!`, ephemeral: true })
            let table = new ascii(`List roles`);
            table.setHeading("Position", "Name");
            await interaction.guild.roles.cache.forEach(async (rolel) => {
                await table.addRow(`${(parseInt(interaction.guild.roles.cache.size) - rolel.position).toString()}`, `${rolel.name}`)
            })
            return interaction.reply({
                content: `\`\`\`${table.toString()}\`\`\``,
                ephemeral: true
            })
        } else if (option == 'everyone') {
            await interaction.reply({ content: `<a:Loading:964726137823576074> Loading .....`, ephemeral: true })
            if (type == 'add') {
                await members.forEach(async member => {
                    await member.roles.add(role, `Actioned by ${execulator.user.tag}`).catch(e => { })
                })
                return interaction.editReply({ content: `> \`✅\` Đã thêm vai trò ${role} cho \`mọi người\`!`, ephemeral: true })
            } else {
                await members.forEach(async member => {
                    await member.roles.remove(role, `Actioned by ${execulator.user.tag}`).catch(e => { })
                })
                return interaction.editReply({ content: `> \`✅\` Đã bỏ vai trò ${role} khỏi \`mọi người\`!`, ephemeral: true })
            }
        } else if (option == 'bots') {
            await interaction.reply({ content: `<a:Loading:964726137823576074> Loading .....`, ephemeral: true })
            if (type == 'add') {
                await members.forEach(async member => {
                    if (member.user.bot) {
                        await member.roles.add(role, `Actioned by ${execulator.user.tag}`).catch(e => { })
                    }
                })
                return interaction.editReply({ content: `> \`✅\` Đã thêm vai trò ${role} cho \`bots\`!`, ephemeral: true })
            } else {
                await members.forEach(async member => {
                    if (member.user.bot) {
                        await member.roles.remove(role, `Actioned by ${execulator.user.tag}`).cache(e => { })
                    }
                })
                return interaction.editReply({ content: `> \`✅\` Đã bỏ vai trò ${role} khỏi \`bots\`!`, ephemeral: true })
            }
        } else if (option == 'humans') {
            await interaction.reply({ content: `<a:Loading:964726137823576074> Loading .....`, ephemeral: true })
            if (type == 'add') {
                await members.forEach(async member => {
                    if (!member.user.bot) {
                        await member.roles.add(role, `Actioned by ${execulator.user.tag}`).catch(e => { })
                    }
                })
                return interaction.editReply({ content: `> \`✅\` Đã thêm vai trò ${role} cho \`con người\`!`, ephemeral: true })
            } else {
                await members.forEach(async member => {
                    if (!member.user.bot) {
                        await member.roles.remove(role, `Actioned by ${execulator.user.tag}`).catch(e => { })
                    }
                })
                return interaction.editReply({ content: `> \`✅\` Đã bỏ vai trò ${role} khỏi \`con người\`!`, ephemeral: true })
            }
        }
    }
}
