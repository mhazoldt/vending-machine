let mysql = require('mysql')
let connection = mysql.createConnection({
    host     : 'localhost',
    database: 'vending_machine',
    user     : 'root',
    password : ''
  });

  module.exports = connection