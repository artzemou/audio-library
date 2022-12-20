const mysql = require('mysql');
const chalk = require('chalk')
const {DB_HOST, DB_USER, DB_PASSWORD, DB_NAME} = require('../config')

var connection = mysql.createConnection({
    host     : DB_HOST,
    user     : DB_USER,
    password : DB_PASSWORD,
    database : DB_NAME
})

connection.connect((err) => {
    if (err) throw err
    else  console.log(chalk`{green ✅  Connected to mysql database ${connection.config.database}}`)
})

// keep connection alive
setInterval( () => {
    var datetime = Date.now()
    connection.query('SELECT 1')
    // console.log('Keep alive the connection. ' + datetime)
}, 4000)

module.exports = connection;
