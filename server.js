var express = require('express');
var app = express();
var http = require('http').Server(app);
var DBapp = require('./app');

app.use(express.static(__dirname + '/static'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendfile('views/autoBuild.html');
});

app.post('/call-serverdb', function (req, res, next) {
  console.log(req.body.text);

  var mres = res;
  DBapp.query(req.body.text, (err, res) => {
    //console.log(res)
    mres.send(JSON.stringify(res.rows));
  });
});

app.post('/call-serverenddb', function (req, res, next) {
  if(req.body.end="true")
    DBapp.end();

});

http.listen(3030, function () {
  console.log('listening on *:3030');
});