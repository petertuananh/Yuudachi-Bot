const mysql = require("mysql");
const login = require("../config.json");

const config = {
    host: login.databases.mysql.host,
    user: login.databases.mysql.user,
    password: login.databases.mysql.password,
    database: login.databases.mysql.database,
    supportBigNumbers: login.databases.mysql.supportBigNumbers,
    bigNumberStrings: login.databases.mysql.bigNumberStrings,
    multipleStatements: login.databases.mysql.multipleStatements,
    charset: login.databases.mysql.charset,
    connectionLimit: login.databases.mysql.connectionLimit
}

const pool = mysql.createPool(config)
exports.con = pool;
exports.mysql = mysql;


// var con = mysql.createConnection({
//     host: login.databases.mysql.host,
//     user: login.databases.mysql.user,
//     password: login.databases.mysql.password,
//     database: login.databases.mysql.database,
// });

// con.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
// });