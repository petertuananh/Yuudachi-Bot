const { readdirSync } = require('fs');
const ascii = require('ascii-table');

let table = new ascii('Gotoubun Commands');
table.setHeading('List', ' Status');

module.exports = client => {
    try {
        readdirSync(`./Commands/`).forEach(dir => {
            const commands = readdirSync(`./Commands/${dir}/`).filter(file => file.endsWith(".js"));

            for (let file of commands) {

                let pull = require(`../Commands/${dir}/${file}`);

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