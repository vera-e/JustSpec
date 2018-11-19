const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'justspec',
    password: 'corgi',
    port: '5432'
});

client.connect();

module.exports = client;

// client.query('SELECT * from part', (err, res) => {
//     res.rows.forEach(function(row) {
//         console.log(row);
//     });
//     client.end();
// });