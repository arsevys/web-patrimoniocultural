var express = require("express");
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");

var puerto = process.env.PORT || 3100;

var path=require('path');
var ejs= require('ejs');
//var ejs = require("ejs");
var routes = require('./apps/Routes/routes');
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
app.use(bodyParser.json({limit: '10mb', extended: true}));
app.set('view engine','ejs');
app.set('views',__dirname+"/public");
app.use(express.static(path.join(__dirname,"public")));//especifica 

routes.asignandoEnrutador(app)

app.listen(puerto, () => {
    console.log("El servidor se esta ejecutando por el puerto -> " + puerto);
})
