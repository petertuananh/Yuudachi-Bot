const express = require("express")
const app = express()
const fs = require("fs")
const client = require("../index")
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

const checkAuth = (req, res, next) => {
    if (!req.query.token || req.query.token !== client.config.server.token) return res.json({code : 301, msg : "Invalid token!"})
    return next()
}


app.get("/", (req, res) => {
    res.status(200).json({code : 200, msg : "Hello world"})
})

app.get("/bot/prefixes", checkAuth, async (req, res) => {
    res.json({success : true, prefixes : client.config.setting.prefixes})
})

app.get("/setting/:guildId/commands", checkAuth, async (req, res) => {
    if (!req.params.guildId) return res.json({ success : false, msg : `Unknown guild!` })
    let prefix = []
    fs.readdirSync(`./commands/prefix/`).forEach(dir => {
        const commands = fs.readdirSync(`./commands/prefix/${dir}/`).filter(file => file.endsWith(".js"));
        for (let file of commands) {
            let pull = require(`../commands/prefix/${dir}/${file}`);
    
            if (pull.name) {
                client.mysql.query(`SELECT * FROM COMMAND_DISABLED WHERE guild_id=${req.params.guildId} && cmd_name="${pull.name}"`, async (err, res) => {
                    prefix.push({name : pull.name, description : pull.description, disabled : res[0] ? true : false});
                })
                continue;
            } else {
                continue;
            }
        }
    });
    let slash = []
    fs.readdirSync(`./commands/slash/`).forEach(dir => {
        const commands = fs.readdirSync(`./commands/slash/${dir}/`).filter(file => file.endsWith(".js"));
        for (let file of commands) {
            let pull = require(`../commands/slash/${dir}/${file}`);
    
            if (pull.name) {
                client.mysql.query(`SELECT * FROM COMMAND_DISABLED WHERE guild_id=${req.params.guildId} && cmd_name="${pull.name}"`, async (err, res) => {
                    slash.push({name : pull.name, description : pull.description, disabled : res[0] ? true : false});
                })
                continue;
            } else {
                continue;
            }
        }
    });
    setTimeout(() => {
        return res.status(200).json({
            prefix : prefix,
            slash : slash
        })
    }, 2000)
})

app.get("/setting/:guildId/cmdlog", checkAuth, async (req, res) => {
    client.mysql.query(`SELECT * FROM CMD_LOG WHERE guild_id=${req.params.guildId}`, async (err, rs) => {
        if (!rs[0]) return res.json({success : false, msg : `No command used!`})
        return res.json(rs)
    })
})

app.post("/setting/:guildId/commands/slash", checkAuth, async (req, res) => {
    if (!req.params.guildId) return res.json({ success : false, msg : `Unknown guild!` })
    if (!req.body.toggles) {
        client.mysql.query(`INSERT INTO COMMAND_DISABLED(guild_id, cmd_name) VALUES (${req.params.guildId}, "${req.body.command}")`, (err, rs) => {
            if (err) return res.json({ success : false })
            return res.json({ success : true })
        })
    } else {
        client.mysql.query(`DELETE FROM COMMAND_DISABLED WHERE guild_id=${req.params.guildId} && cmd_name="${req.body.command}"`, (err, rs) => {
            if (err) return res.json({ success : false })
            return res.json({ success : true })
        })
    }
})

app.listen(client.config.server.port)