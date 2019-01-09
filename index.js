var config = require("./config.js");
var CryptoAPIHandler = require("./modules/CryptoCompareAPIHandler");
var Helpers = require("./modules/Helpers");

var express = require("express");
var request = require("request");
var cors = require('cors');
var fs = require('fs')
const bodyParser = require('body-parser');
var https = require('https');
var app = express();

app.listen(config.express.http.port);

app.use(cors({ origin: '*' }));
app.use(bodyParser.json({limit: '5000mb'}));
app.use(bodyParser.urlencoded({limit: '5000mb', extended: true,parameterLimit: 100000}));

https.createServer({
key: fs.readFileSync('darrengriffin.app.key'),
cert: fs.readFileSync('darrengriffin.app.crt'),
}, app).listen((config.express.https.port || 443));

/* Initial Function Calling */
CryptoAPIHandler.getCoinList();

/* Automated Function Calling */
setInterval(function () {
}, 10 * 1000);

setInterval(function () {
    CryptoAPIHandler.getCoinList();
}, 60 * 1000);

/* serves main page */
app.get("/", function (req, res) {
    res.json(req.body)
    res.end();
});

//CryptoAPIHandler.getCoinList();
app.get("/cryptocurrency", function (req, res) {
    res.json(CryptoAPIHandler.data);
    res.end();   
});

app.get("/cryptocurrency/:base64", function (req, res) {
    if (Buffer.from(req.params.base64, 'base64').toString('base64') != req.params.base64) {
        res.end("Invalid JSON");
    } else {
        var portfolio = JSON.parse(Buffer.from(req.params.base64, 'base64').toString());
        if(result = CryptoAPIHandler.calculatePortfolio(portfolio)){
            res.json(result);
        }else{
            res.end("Invalid Data Structure");
        }
    }
});