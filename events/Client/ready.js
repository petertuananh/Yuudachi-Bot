const client = require('../../index.js');
const ascii = require('ascii-table');
// const express = require('express');
// const server = express();
// const port = 3000 || 3001;
client.on('ready', (message) => {
    client.user.setStatus("online")
    console.log(`[SERVER INFO] ${client.user.username} ready !`);
    client.user.setActivity('Simple to partner', { type: 'PLAYING' })
    let table = new ascii(`${client.user.username}`);
    table.setHeading("List", "Info");
    table.addRow(`Bot Name`, `${client.user.username}`)
    table.addRow(`Total Commands`, `${client.commands.size} commands`)
    console.log(table.toString())
    var current = new Date();
})
