
var APIController= require('./../Controllers/ApiController')

exports.asignandoEnrutador = function(app) {

app.get("/web",APIController.inicial)
app.get("/menu",APIController.menu)
app.get("/lugar",APIController.lugar)
app.get("/menulugar",APIController.menulugar)
app.get("/",APIController.init)

app.post("/registrar",APIController.registrar)

app.get("/listanew",APIController.listanew)

app.post("/bien",APIController.bien)
app.post("/mal",APIController.mal)
app.post("/listatimeline",APIController.listatime)
//app.get("/listar",MDPController.listarviajes)


app.post("/login",APIController.inicio);

// app.get("/mensaje",Global.envio)
}