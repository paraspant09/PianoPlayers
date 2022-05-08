const mysql=require('mysql2');
require('dotenv').config();

module.exports = mysql.createPool({
    connectionLimit : 100,
    port        : process.env.DB_PORT,
    host        : process.env.DB_HOST,
    user        : process.env.DB_USER,
    password    : process.env.DB_PASSWORD,
    database    : 'piano'
}).promise();