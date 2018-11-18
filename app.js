const { Client } = require('pg');
var express = require("express");
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

const client = new Client({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'justspec',
    password: 'corgi',
    port: '5433'
});

client.connect();


app.get("/product/cpu", function (req, res) {
    client.query('SELECT * from part WHERE part_type = 1 ORDER BY part_name', (err, cpu_data) => {
        if (err) {
            console.log(err);
        } else {
            console.log(cpu_data.rows);
            res.render("cpu", { cpu_data: cpu_data.rows });
        }
        client.end();
    });
});

app.get("/builds", function (req, res) {
    client.query('SELECT * from computer_build', (err1, computer_builds) => {
        if (err1) {
            console.log(err1);
        } else {
            computer_builds.rows.forEach(function (build) {
                console.log(build.build_data);
                for (var eachPart in build.build_data) {
                    console.log(eachPart + ": " + build.build_data[eachPart]);


                    // if (eachPart != 'storage' and eachPart != 'quantity_ram' and eachPart != 'quantity_display') {
                    //     client.query('SELECT * from part WHERE part_id = ' + build.build_data[eachPart], (err2, partData) => {
                    //         if (err2) {
                    //             console.log(err2);
                    //         } else {
                    //             console.log(build.build_name + ": " + partData.rows[0].part_name);
                    //         }
                    //     });
                    // }
                }
            });
            //res.render("builds", { computer_builds: computer_builds.rows });
        }
    });
});



app.listen(3000, function () {
    console.log("JustSpec server has started");
});