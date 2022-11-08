const { readdirSync } = require('fs');
const ascii = require('ascii-table');

let table = new ascii('Slash commands');
table.setHeading('List', ' Status');

module.exports = (client) => {
    let slashcommands = []

	readdirSync(`./commands/slash/`).forEach(dir => {
		const commands = readdirSync(`./commands/slash/${dir}/`).filter(file => file.endsWith(".js"));

		for (let file of commands) {
            let pull = require(`../commands/slash/${dir}/${file}`);

            if (pull.name) {
                client.slashcommands.set(pull.name, pull);
                slashcommands.push(pull);
                table.addRow(file, `Success ✔`);
                continue;
            } else {
                table.addRow(file, `Error ✖`);
                continue;
            }
		}
	});
	console.log(table.toString().rainbow);

    client.on('ready', async () => {
        await client.application.commands.set(slashcommands)
    })
};