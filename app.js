const { Client } = require('pg');
var express = require("express"),
    bodyParser = require("body-parser"),
    cookieParser = require('cookie-parser'),
    app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

app.set("view engine", "ejs");

const pg = new Client({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'justspec',
    password: 'corgi',
    port: '5433'
});

pg.connect();

app.get('/', function (req, res) {
    //console.log('Cookies: ', req.cookies)
})

app.get('/list', function (req, res) {
    textQuery = "";
    if (req.cookies.cpu != undefined) {
        if (textQuery != '') {
            textQuery += ' UNION '
        }
        textQuery += 'SELECT * from part WHERE part_id = ' + req.cookies.cpu;
    } if (req.cookies.cpu_cooler != undefined) {
        if (textQuery != '') {
            textQuery += ' UNION '
        }
        textQuery += 'SELECT * from part WHERE part_id = ' + req.cookies.cpu_cooler;
    } if (req.cookies.motherboard != undefined) {
        if (textQuery != '') {
            textQuery += ' UNION '
        }
        textQuery += 'SELECT * from part WHERE part_id = ' + req.cookies.motherboard;
    } if (req.cookies.ram != undefined) {
        if (textQuery != '') {
            textQuery += ' UNION '
        }
        textQuery += 'SELECT * from part WHERE part_id = ' + req.cookies.ram;
    } if (req.cookies.gpu != undefined) {
        if (textQuery != '') {
            textQuery += ' UNION '
        }
        textQuery += 'SELECT * from part WHERE part_id = ' + req.cookies.gpu;
    } if (req.cookies.psu != undefined) {
        if (textQuery != '') {
            textQuery += ' UNION '
        }
        textQuery += 'SELECT * from part WHERE part_id = ' + req.cookies.psu;
    } if (req.cookies.case != undefined) {
        if (textQuery != '') {
            textQuery += ' UNION '
        }
        textQuery += 'SELECT * from part WHERE part_id = ' + req.cookies.case;
    } if (req.cookies.display != undefined) {
        if (textQuery != '') {
            textQuery += ' UNION '
        }
        textQuery += 'SELECT * from part WHERE part_id = ' + req.cookies.display;
    }
    if (textQuery !== "") {
        textQuery += ' ORDER BY part_type asc '
        console.log(textQuery);
        pg.query(textQuery, (err, part_data) => {
            console.log('Query happen');
            res.render('list', { part_data: part_data.rows });
        });
    }
    else {
        console.log('Query not happen')
        res.render('list')
    }

});

app.post('/list', function (req, res) {
    console.log(req.query.type);
    console.log(req.query.id);
    textPart = "";
    switch (req.query.type) {
        case '1':
            textPart = 'cpu';
            break;
        case '2':
            textPart = 'cpu_cooler';
            break;
        case '3':
            textPart = 'motherboard';
            break;
        case '4':
            textPart = 'ram';
            break;
        case '5':
            textPart = 'gpu';
            break;
        case '7':
            textPart = 'psu';
            break;
        case '8':
            textPart = 'case';
            break;
        case '9':
            textPart = 'display';
            break;
    }
    res.cookie(textPart, req.query.id).redirect('/list');
});

app.get("/product/:part", function (req, res) {

    // choose which type of part to display 
    //by using url (9 total)
    partType = '0';
    switch (req.params.part) {
        case 'cpu':
            partType = '1';
            break;
        case 'cpu-cooler':
            partType = '2';
            break;
        case 'motherboard':
            partType = '3';
            break;
        case 'ram':
            partType = '4';
            break;
        case 'gpu':
            partType = '5';
            break;
        case 'storage':
            partType = '6';
            break;
        case 'psu':
            partType = '7';
            break;
        case 'case':
            partType = '8';
            break;
        case 'display':
            partType = '9';
            break;
    }

    //prepare string to query  
    textQuery = 'SELECT * from part WHERE part_type =' + partType + ' ORDER BY part_name';
    //query by pg and some callback 
    pg.query(textQuery, (err, part_data) => {
        if (err) {
            console.log(err);
        } else {
            console.log(part_data.rows);

            //pasrse queried array of object to displayPart.ejs 
            res.render("displayPart", { part_data: part_data.rows });
        }
        //pg.end();
    });

});

app.get("/builds", function (req, res) {
    queryText =
        "select P.part_id, P.part_type, P.part_name, P.part_price, P.part_score, P.part_data, CB.build_id, CB.build_name, CB.build_price from  part as P, computer_build as CB \
    where P.part_id = (CB.build_data->>'cpu')::numeric \
    UNION \
    select P.part_id, P.part_type, P.part_name, P.part_price, P.part_score, P.part_data, CB.build_id, CB.build_name, CB.build_price from  part as P, computer_build as CB \
    where P.part_id = (CB.build_data->>'cpu_cooler')::numeric \
    UNION \
    select P.part_id, P.part_type, P.part_name, P.part_price, P.part_score, P.part_data, CB.build_id, CB.build_name, CB.build_price from  part as P, computer_build as CB \
    where P.part_id = (CB.build_data ->> 'motherboard'):: numeric \
    UNION \
    select P.part_id, P.part_type, P.part_name, P.part_price, P.part_score, P.part_data, CB.build_id, CB.build_name, CB.build_price from  part as P, computer_build as CB \
    where P.part_id = (CB.build_data ->> 'ram'):: numeric \
    UNION \
    select P.part_id, P.part_type, P.part_name, P.part_price, P.part_score, P.part_data, CB.build_id, CB.build_name, CB.build_price from  part as P, computer_build as CB \
    where P.part_id = (CB.build_data ->> 'gpu'):: numeric \
    UNION \
    select P.part_id, P.part_type, P.part_name, P.part_price, P.part_score, P.part_data, CB.build_id, CB.build_name, CB.build_price from  part as P, computer_build as CB \
    where P.part_id = (CB.build_data ->> 'psu'):: numeric \
    UNION \
    select P.part_id, P.part_type, P.part_name, P.part_price, P.part_score, P.part_data, CB.build_id, CB.build_name, CB.build_price from  part as P, computer_build as CB \
    where P.part_id = (CB.build_data ->> 'case'):: numeric \
    UNION \
    select P.part_id, P.part_type, P.part_name, P.part_price, P.part_score, P.part_data, CB.build_id, CB.build_name, CB.build_price from  part as P, computer_build as CB \
    where P.part_id = (CB.build_data ->> 'display'):: numeric \
    ORDER BY build_id asc, \
    part_type asc";
    pg.query(queryText, (err1, computer_builds) => {
        if (err1) {
            console.log("POSTGRES ERROR: " + err1);
        } else {
            res.render("builds", { computer_builds: computer_builds.rows });
        }
    });
});

app.listen(3000, function () {
    console.log("JustSpec server has started");
});