var pg = require('pg');

var config = {
    database: 'betelgeuse', //the name of the database
    host: 'localhost',  // where is your database is located server
    port: 5432, //port for database
    max: 10, //max # connections allowed at a time.
    idleTimeoutMillis: 3000 //30 seconds to try to connect
}

module.exports = pg.Pool(config);