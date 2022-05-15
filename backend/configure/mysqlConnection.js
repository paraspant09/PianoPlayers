const mysql=require('mysql2');
const DB_Options=require('../constants/MysqlDBOptions');

module.exports = mysql.createPool(DB_Options).promise();