const client = require('../../index.js');
const ascii = require('ascii-table');
const dashboard = require("../../dashboard/server")
client.on('ready', async (message) => {
    client.user.setStatus("online")
    console.log(`[SERVER INFO] ${client.user.username} ready !`);
    // client.user.setStatus(client.config.setting.presence.status)

    function statusOnline() {
        client.user.setStatus("online")
        setTimeout(() => {
            statusIdle()
        }, 10000)
    }
    function statusIdle() {
        client.user.setStatus("idle")
        setTimeout(() => {
            statusDnd()
        }, 10000)
    }
    function statusDnd() {
        client.user.setStatus("dnd")
        setTimeout(() => {
            statusOnline()
        }, 10000)
    }


    client.user.setActivity(client.config.setting.presence.activity)
    // const guild = await client.guilds.cache.get("1013647246769795102");
    //     const role = await guild.roles.cache.get("1013846044611715134");
    //     role.setPosition(70).then(() => {
    //         console.log(1)
    //     })
    const dash = dashboard
    let table = new ascii(`${client.user.username}`);
    table.setHeading("List", "Info");
    table.addRow(`Client`, `${client.user.tag}`)
    table.addRow(`Prefix commands`, `${client.commands.size} commands`)
    table.addRow(`Slash commands`, `${client.slashcommands.size} commands`)
    table.addRow(`Dashboard`, `${dash ? `Launched` : `Not launched`}`)
    console.log(table.toString())
})
