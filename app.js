const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'justspec',
    password: 'YOUR PASSWORD',
    port: 'YOUR PORT'
});

client.connect();

client.query('SELECT * from part', (err, res) => {
    res.rows.forEach(function(row) {
        console.log(row);
    });
    client.end();
});