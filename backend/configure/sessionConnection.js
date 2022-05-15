const session = require('express-session');
const MysqlStore = require('express-mysql-session')(session);
const DB_Options = require('../constants/MysqlDBOptions');
const db=require('../configure/mysqlConnection');

const  sessionStore = new MysqlStore({...DB_Options,createDatabaseTable: true},db);

const IN_PROD = process.env.NODE_ENV === 'production';
const TWO_HOURS = 1000 * 60 * 60 * 2;

const sessionConnection = session({
    name: process.env.SESSION_NAME,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    cookie: {
        httpOnly: true,
        maxAge: TWO_HOURS,
        sameSite: true,
        secure: IN_PROD
    }
});

module.exports = {sessionConnection,sessionStore};