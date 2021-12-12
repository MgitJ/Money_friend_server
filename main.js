var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(3000, 'localhost', function () {
    console.log('서버 실행 중...');
});

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "example2",
    password: "1234",
    port: 3306,
    multipleStatements: true
});


const user = require('./routes/user')(connection);
app.use('/user',user);

const friend = require('./routes/friend')(connection);
app.use('/friend',friend);

const group = require('./routes/group')(connection);
app.use('/group',group);
