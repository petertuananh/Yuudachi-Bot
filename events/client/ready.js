const client = require('../../index.js');
const ascii = require('ascii-table');
const dashboard = require("../../dashboard/server")
client.on('ready', (message) => {
    client.user.setStatus("online")
    console.log(`[SERVER INFO] ${client.user.username} ready !`);
    client.user.setPresence({
        status : client.config.setting.presence.status,
        activities : {
            name : client.config.setting.presence.activity,
        },
    })
    const dash = dashboard
    let table = new ascii(`${client.user.username}`);
    table.setHeading("List", "Info");
    table.addRow(`Client`, `${client.user.tag}`)
    table.addRow(`Prefix commands`, `${client.commands.size} commands`)
    table.addRow(`Slash commands`, `${client.slashcommands.size} commands`)
    table.addRow(`Dashboard`, `${dash ? `Launched` : `Not launched`}`)
    console.log(table.toString())
})
