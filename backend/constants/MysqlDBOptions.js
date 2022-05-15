const DB_Options={
    connectionLimit : 100,
    port        : process.env.DB_PORT,
    host        : process.env.DB_HOST,
    user        : process.env.DB_USER,
    password    : process.env.DB_PASSWORD,
    database    : process.env.DB_DATABASE
};

module.exports = DB_Options;