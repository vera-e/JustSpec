const { Client } = require('pg');
var express = require("express");
var bodyParser = require("body-parser");

var app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.static(__dirname + "\views"));
app.use("/public", express.static(__dirname + "/public"));

const client = new Client({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'justspec',
    password: 'corgi',
    port: '5432'
});

client.connect();
var builds = [];

client.query('SELECT * from computer_build', (err, res) => {
    // res.rows.forEach(function(row) {
    //     console.log(row);
    console.log(res.rows);
    //});
    builds = res.rows;
});

app.get("/", function (reqest, respond) {
    console.log(reqest.query);
    var textPrice = '';
    if (reqest.query.minPrice && reqest.query.maxPrice){
        textPrice = ' AND build_price BETWEEN ' + reqest.query.minPrice + ' AND ' + reqest.query.maxPrice + ' ';
    }
    var textSort = 'build_name,';
    if (reqest.query.sort == '1') {
        textSort = 'build_name,';
    } else if (reqest.query.sort == '2') {
        textSort = 'build_name desc, ';
    } else if (reqest.query.sort == '3') {
        textSort = 'build_price,';
    } else if (reqest.query.sort == '4') {
        textSort = 'build_price desc,';
    }
    queryText =
        " select * from  part as P, computer_build as CB \
         where P.part_id = (CB.build_data->>'1')::numeric " + textPrice +
        " UNION \
        select * from  part as P, computer_build as CB \
         where P.part_id = (CB.build_data->>'2')::numeric " + textPrice +
        " UNION \
        select * from  part as P, computer_build as CB \
         where P.part_id = (CB.build_data->>'3')::numeric " + textPrice +
        " UNION \
        select * from  part as P, computer_build as CB \
         where P.part_id = (CB.build_data->>'4')::numeric " + textPrice +
        " UNION \
        select * from  part as P, computer_build as CB \
         where P.part_id = (CB.build_data->>'5')::numeric " + textPrice +
        " UNION \
        select * from  part as P, computer_build as CB \
         where P.part_id = (CB.build_data->>'6')::numeric " + textPrice +
        " UNION \
        select * from  part as P, computer_build as CB \
         where P.part_id = (CB.build_data->>'7')::numeric " + textPrice +
        " UNION \
        select * from  part as P, computer_build as CB \
         where P.part_id = (CB.build_data->>'8')::numeric " + textPrice +
        " UNION \
        select * from  part as P, computer_build as CB \
         where P.part_id = (CB.build_data->>'9')::numeric " + textPrice +
        " order by " + textSort + " build_id, part_type asc" ;
        console.log(queryText);
    client.query(queryText, (err1, computer_builds) => {
        if (err1) {
            console.log("POSTGRES ERROR: " + err1);
        } else {
            //console.log(JSON.stringify(computer_builds.rows));
            respond.render("completeBuild_page", { computer_builds: computer_builds.rows });
        }
    });
});


// app.get("/compare", function (reqest, respond) {
//     respond.render("compare_page", { cp_builds: builds });
// });

app.get("/compare", function (reqest, respond) {
    console.log(reqest.query.buildId);
    stringToChoose = "("
    for (var i = 0; i < reqest.query.buildId.length - 1; i++) {
        // console.log(reqest.body['buildId'][i]);
        stringToChoose += reqest.query.buildId[i] + ", "
    }
    stringToChoose += reqest.query.buildId.pop();
    stringToChoose += ")";
    console.log(stringToChoose);
    stringQuery = "select * from  part as P , computer_build as CB \
    where CB.build_id IN "+ stringToChoose +
        " and (CB.build_data->>'1')::numeric = P.part_id UNION \
    select * from  part as P , computer_build as CB \
    where CB.build_id IN "+ stringToChoose +
        " and (CB.build_data->>'2')::numeric = P.part_id UNION \
    select * from  part as P , computer_build as CB \
    where CB.build_id IN "+ stringToChoose +
        " and (CB.build_data->>'3')::numeric = P.part_id UNION \
    select * from  part as P , computer_build as CB \
    where CB.build_id IN "+ stringToChoose +
        " and (CB.build_data->>'4')::numeric = P.part_id UNION \
    select * from  part as P , computer_build as CB \
    where CB.build_id IN "+ stringToChoose +
        " and (CB.build_data->>'5')::numeric = P.part_id UNION \
    select * from  part as P , computer_build as CB \
    where CB.build_id IN "+ stringToChoose +
        " and (CB.build_data->>'6')::numeric = P.part_id UNION \
    select * from  part as P , computer_build as CB \
    where CB.build_id IN "+ stringToChoose +
        " and (CB.build_data->>'7')::numeric = P.part_id UNION \
    select * from  part as P , computer_build as CB \
    where CB.build_id IN "+ stringToChoose +
        " and (CB.build_data->>'8')::numeric = P.part_id UNION \
    select * from  part as P , computer_build as CB \
    where CB.build_id IN "+ stringToChoose +
        " and (CB.build_data->>'9')::numeric = P.part_id" +
        " order by part_type, build_id asc"
    client.query(stringQuery, (err1, computer_builds) => {
        if (err1) {
            console.log("POSTGRES ERROR: " + err1);
        } else {
            // console.log(JSON.stringify(computer_builds.rows));
            respond.render("compare_page", { computer_builds: computer_builds.rows });
        }
    });
});

app.listen(3000, function () {
    console.log(__dirname);
});

