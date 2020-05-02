/*------------------ SET UP configuration of PostgreSQL connection------------------------------------------*/
// Kilde: https://blog.logrocket.com/setting-up-a-restful-api-with-node-js-and-postgresql-d96d6fc892d8/

// Create Database and use the following credentials:
const { Pool } = require('pg');

const pool = new Pool( {
    host: "localhost",
    port: 5433,
    user: "testUser",
    database: "testdb",
    password: "password",
});

pool.on('connect', () => {
    console.log('connected to the Database');
});

/*
pool.query('SELECT NOW()').then(result => {
    console.log(result.rows)
    pool.end()
});*/

module.exports = pool;
