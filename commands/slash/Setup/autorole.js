const Discord = require('discord.js')
const ascii = require("ascii-table")
const { parse, stringify } = require('lossless-json')
module.exports = {
    name: "autorole",
    description: "Vai trò tự động cho người dùng",
    ownerOnly: false,
    voterOnly: true,
    BotPerms: ["ManageRoles"],
    /**
     * @arg {Discord.Client} client
     * @arg {Discord.Interaction} interaction
     */
    options: [
        {
            name: "join",
            description: "Vai trò tự động khi thành viên tham gia máy chủ",
            type: Discord.ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: "enable",
                    description: "Bật chế độ thêm vai trò tự động",
                    type: Discord.ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: "disable",
                    description: "Tắt chế độ thêm vai trò tự động",
                    type: Discord.ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: "add",
                    description: "Thêm vai trò",
                    type: Discord.ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "role",
                            description: "Vai trò",
                            type: Discord.ApplicationCommandOptionType.Role,
                            required: true,
                        },
                    ]
                },
                {
                    name: "view",
                    description: "Xem các vai trò đã thêm",
                    type: Discord.ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: "remove",
                    description: "Bỏ vai trò",
                    type: Discord.ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "role",
                            description: "Vai trò",
                            type: Discord.ApplicationCommandOptionType.Role,
                            required: true,
                        },
                    ]
                },
                {
                    name: "reset",
                    description: "Bỏ các vai trò đã thêm",
                    type: Discord.ApplicationCommandOptionType.Subcommand,
                },
            ]
        },
        {
            name: "streaming",
            description: "Vai trò tự động khi thành viên bắt đầu phát trực tiếp",
            type: Discord.ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: "enable",
                    description: "Bật chế độ thêm vai trò tự động",
                    type: Discord.ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: "disable",
                    description: "Tắt chế độ thêm vai trò tự động",
                    type: Discord.ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: "add",
                    description: "Thêm vai trò",
                    type: Discord.ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "role",
                            description: "Vai trò",
                            type: Discord.ApplicationCommandOptionType.Role,
                            required: true,
                        },
                    ]
                },
                {
                    name: "view",
                    description: "Xem các vai trò đã thêm",
                    type: Discord.ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: "remove",
                    description: "Bỏ vai trò",
                    type: Discord.ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "role",
                            description: "Vai trò",
                            type: Discord.ApplicationCommandOptionType.Role,
                            required: true,
                        },
                    ]
                },
                {
                    name: "reset",
                    description: "Bỏ các vai trò đã thêm",
                    type: Discord.ApplicationCommandOptionType.Subcommand,
                },
            ],
        },
    ],
    run: async (client, interaction) => {
        const groupName = interaction.options._group
        const subCommand = interaction.options.getSubcommand()
        const role = interaction.options.getRole("role") ? await interaction.options.getRole("role").id : null
        if (groupName == 'join') {
            client.mysql.query(`SELECT * FROM ROLE_AUTO WHERE guild_id=${interaction.guild.id} && type='join'`, async (err, res) => {
                if (subCommand == 'enable') {
                    if (res[0]) {
                        client.mysql.query(`UPDATE ROLE_AUTO SET isEnabled="true" WHERE guild_id=${interaction.guild.id} && type='join'`)
                    } else {
                        client.mysql.query(`INSERT INTO ROLE_AUTO(guild_id, isEnabled, type, roles) VALUES (${interaction.guild.id}, 'true', 'join', '[]')`)
                    }
                    return interaction.reply({
                        content: `> \`✅\` Thực thi thành công!`
                    })
                } else if (subCommand == 'disable') {
                    client.mysql.query(`UPDATE ROLE_AUTO SET isEnabled="false" WHERE guild_id=${interaction.guild.id} && type='join'`)
                    return interaction.reply({
                        content: `> \`✅\` Thực thi thành công!`
                    })
                } else if (subCommand == 'add') {
                    if (!res[0]) return interaction.reply({
                        content: `> \`❌\` Vui lòng bật module \`auto role\` để sử dụng lệnh này!`,
                        ephemeral : true
                    })
                    const roles = parse(res[0].roles)

                    roles.push(role)
                    client.mysql.query(`UPDATE ROLE_AUTO SET roles="[${roles.toString()}]" WHERE guild_id=${interaction.guild.id} && type='join'`)
                    return interaction.reply({
                        content: `> \`✅\` Thực thi thành công! Đã thêm vai trò <@&${role}>`,
                        allowedMentions: { parse: [] }
                    })
                } else if (subCommand == 'view') {
                    if (!res[0]) return interaction.reply({
                        content: `> \`❌\` Vui lòng bật module \`auto role\` để sử dụng lệnh này!`,
                        ephemeral : true
                    })
                    let table = new ascii(`Roles`);
                    table.setHeading("Name");
                    const roles = parse(res[0].roles)
                    await roles.forEach(async (roleShow) => {
                        const r = await interaction.guild.roles.cache.get(roleShow.value)
                        if (!r) return;
                        table.addRow(`${r.name}`)
                    })
                    return interaction.reply({
                        content : `\`\`\`${table.toString()}\`\`\``, 
                        ephemeral : false
                    })
                } else if (subCommand == 'remove') {
                    if (!res[0]) return interaction.reply({
                        content: `> \`❌\` Vui lòng bật module \`auto role\` để sử dụng lệnh này!`,
                        ephemeral : true
                    })
                    const roles = parse(res[0].roles)

                    function removeElement(array, elem) {
                        var index = array.indexOf(elem);
                        if (index > -1) {
                            array.splice(index, 1);
                        }
                    }
                    await removeElement(roles, role);
                    client.mysql.query(`UPDATE ROLE_AUTO SET roles="[${roles.toString()}]" WHERE guild_id=${interaction.guild.id} && type='join'`)
                    return interaction.reply({
                        content: `> \`✅\` Thực thi thành công! Đã xóa vai trò <@&${role}>`,
                        allowedMentions: { parse: [] }
                    })
                } else if (subCommand == 'reset') {
                    client.mysql.query(`DELETE FROM ROLE_AUTO WHERE guild_id=${interaction.guild.id} && type='join'`)
                    return interaction.reply({
                        content: `> \`✅\` Thực thi thành công!`,
                        allowedMentions: { parse: [] }
                    })
                }
            })
        } else if (groupName == 'streaming') {
            client.mysql.query(`SELECT * FROM ROLE_AUTO WHERE guild_id=${interaction.guild.id} && type='streaming'`, async (err, res) => {
                if (subCommand == 'enable') {
                    if (res[0]) {
                        client.mysql.query(`UPDATE ROLE_AUTO SET isEnabled="true" WHERE guild_id=${interaction.guild.id} && type='streaming'`)
                    } else {
                        client.mysql.query(`INSERT INTO ROLE_AUTO(guild_id, isEnabled, type, roles) VALUES (${interaction.guild.id}, 'true', 'streaming', '[]')`)
                    }
                    return interaction.reply({
                        content: `> \`✅\` Thực thi thành công!`
                    })
                } else if (subCommand == 'disable') {
                    client.mysql.query(`UPDATE ROLE_AUTO SET isEnabled="false" WHERE guild_id=${interaction.guild.id} && type='streaming'`)
                    return interaction.reply({
                        content: `> \`✅\` Thực thi thành công!`
                    })
                } else if (subCommand == 'add') {
                    if (!res[0]) return interaction.reply({
                        content: `> \`❌\` Vui lòng bật module \`auto role\` để sử dụng lệnh này!`,
                        ephemeral : true
                    })
                    const roles = parse(res[0].roles)

                    roles.push(role)
                    client.mysql.query(`UPDATE ROLE_AUTO SET roles="[${roles.toString()}]" WHERE guild_id=${interaction.guild.id} && type='streaming'`)
                    return interaction.reply({
                        content: `> \`✅\` Thực thi thành công! Đã thêm vai trò <@&${role}>`,
                        allowedMentions: { parse: [] }
                    })
                } else if (subCommand == 'view') {
                    if (!res[0]) return interaction.reply({
                        content: `> \`❌\` Vui lòng bật module \`auto role\` để sử dụng lệnh này!`,
                        ephemeral : true
                    })
                    let table = new ascii(`Roles`);
                    table.setHeading("Name");
                    const roles = parse(res[0].roles)
                    await roles.forEach(async (roleShow) => {
                        const r = await interaction.guild.roles.cache.get(roleShow.value)
                        if (!r) return;
                        table.addRow(`${r.name}`)
                    })
                    return interaction.reply({
                        content : `\`\`\`${table.toString()}\`\`\``, 
                        ephemeral : false
                    })
                } else if (subCommand == 'remove') {
                    if (!res[0]) return interaction.reply({
                        content: `> \`❌\` Vui lòng bật module \`auto role\` để sử dụng lệnh này!`,
                        ephemeral : true
                    })
                    const roles = parse(res[0].roles)

                    function removeElement(array, elem) {
                        var index = array.indexOf(elem);
                        if (index > -1) {
                            array.splice(index, 1);
                        }
                    }
                    await removeElement(roles, role);
                    client.mysql.query(`UPDATE ROLE_AUTO SET roles="[${roles.toString()}]" WHERE guild_id=${interaction.guild.id} && type='streaming'`)
                    return interaction.reply({
                        content: `> \`✅\` Thực thi thành công! Đã xóa vai trò <@&${role}>`,
                        allowedMentions: { parse: [] }
                    })
                } else if (subCommand == 'reset') {
                    client.mysql.query(`DELETE FROM ROLE_AUTO WHERE guild_id=${interaction.guild.id} && type='streaming'`)
                    return interaction.reply({
                        content: `> \`✅\` Thực thi thành công!`,
                        allowedMentions: { parse: [] }
                    })
                }
            })
        }

    }
}