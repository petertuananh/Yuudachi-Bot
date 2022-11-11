const { readdirSync } = require('fs');
const ascii = require('ascii-table');

let table = new ascii('Prefix Commands');
table.setHeading('List', ' Status');

module.exports = client => {
    try {
        readdirSync(`./commands/prefix/`).forEach(dir => {
            const commands = readdirSync(`./commands/prefix/${dir}/`).filter(file => file.endsWith(".js"));

            for (let file of commands) {

                let pull = require(`../commands/prefix/${dir}/${file}`);

                if (pull.name) {
                    client.commands.set(pull.name, pull);
                    table.addRow(file, 'Success ✔');

                } else {
                    table.addRow(file, `Error ✖`);
                    continue;
                }
                if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach((alias) => client.aliases.set(alias, pull.name));
            }
        });
        console.log(table.toString().rainbow);
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
};