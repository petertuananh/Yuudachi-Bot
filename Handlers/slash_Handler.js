const { readdirSync } = require('fs');
const ascii = require('ascii-table');

let table = new ascii('Gotoubun Slashs');
table.setHeading('List', ' Status');

module.exports = (client) => {
    let slashcommands = []

	readdirSync(`./SlashCommands/`).forEach(dir => {
		const commands = readdirSync(`./SlashCommands/${dir}/`).filter(file => file.endsWith(".js"));

		for (let file of commands) {
            let pull = require(`../SlashCommands/${dir}/${file}`);

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