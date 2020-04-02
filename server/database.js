var mysql = require('mysql');

require('dotenv').config();

const db_config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

console.log(db_config);

var connection;

connection = mysql.createPool(db_config);

connection.on('error', (error) => {
    console.log(error);
    connection = mysql.createPool(db_config);
});

module.exports = connection;