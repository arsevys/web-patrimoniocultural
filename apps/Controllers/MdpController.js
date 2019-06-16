var trip = require("./../Models/TripModel");
var tripdatapoint = require("./../Models/TripDataPointModel");
var token = require("./../Models/TokenModel");
var user = require("./../Models/UserModel");
var utils = require("./../Common/utils");
class MdpController {
    static init(req, res) {
        res.status(200).end();
    }

    static getTime(req,res){

        let time =utils.getTimeCurrent();
        res.json({
            "time":time
        }).end();
    }
    static finViaje(req, res) {
        res.status(200).end();
        console.log(req.body);
        if (!req.body.hasOwnProperty("id")) {
            console.log("No existe una propiedad llamado ID");
            return;
        }
        tripdatapoint.finViaje(req, function(data) {
            console.log("Operacion Completada totalmente .... Excellent!!");
        })
    }
    static weekTripProccessed(req,res){
        let userId=req.body.userId;

        trip.weekTripProccessed(userId,function(data){
            res.json(data).end();
        })
    }
    
    static detalleViaje(req, res) {
        var x = req.body;
        trip.detalleViaje(x.tripId, function(docs) {
            if (docs.length == 0) {
                res.json({
                    "success": false
                });
                res.status(200).end();
            } else {
                res.json(docs[0]);
                res.status(200).end();
            }
        })
    }
    
    static listarViajes(req, res) {
        var x = req.body;
        console.log(x);
        if (x.vin == "-") {
            let y = {
                "trips": [],
                "total": 0
            }
            console.log(y);
            res.json(y);
            res.status(200).end();
            return;
        }
        trip.listarViajes(x.userId, function(docs) {
            let y = {
                "trips": docs,
                "total": docs.length
            }
            console.log(y);
            res.json(y);
            res.status(200).end();
        })
    }
    
    static updateToken(req, res) {
        let x = req.body;
        console.log("updateToken pe")
        token.actualizarToken(x, function(err, data) {
            if (err) {
                res.status(200).json({
                    "success": false
                })
                return;
            }
            
            if(data.matchedCount>0){
                res.status(200).json({
                "success": true
            })
            }else {
                res.status(200).json({
                "success": false
            })
                console.log("Operacion updateToken completado!!")
            }
            
        })
    }
      
    static deleteToken(req, res) {
        let x = req.body;
        console.log("Eliminar Token : ", x)
        token.eliminarToken(x, function(err, data) {
            if (err) {
                res.status(200).json({
                    "success": false
                })
                return;
            }
            console.log(data.deletedCount);
            if (data.deletedCount > 0) {
                res.status(200).json({
                    "success": true
                })
            } else {
                res.status(200).json({
                    "success": false
                })
            }
        })
    }
    
    static login(req, res) {
        var usuario = req.body;
        console.log(usuario);
        user.login(usuario, function(tipo, data) {

            if (tipo == 1) {
                res.json({
                    "success": false,
                    data: null,
                    "message": "Contraseña Incorrecta"
                }).end();
            } else if (tipo == 2) {
                let dataFinal=Object.assign(data,utils.weekend())
                let dat = {

                    "success": true,
                    "data": dataFinal,
                    "message": "Succesfull!"
                }
                res.json(dat).end();
            } else if (tipo == 3) {
                res.json({
                    "success": false,
                    data: null,
                    "message": "Usuario no existe"
                }).end()
            }
        });
    }

     static scoreDWM(req, res) { //score Day Week Mounth
         trip.scoreDWM(req.body,function(data){

             res.json({data:data}).end();

         })
     }
    
    static scoreHistorico(req, res) {
        var usuario = req.body.userId;
        console.log("Llego usuaRIO - 1", usuario);
        try {
            if (!utils.validarIdMongo(usuario)) {
                res.json({
                    "score": null,
                    "success": false
                }).end()
                return;
            }
        } catch (e) {
            console.log("Ocurrio un errror en el try")
            console.log(e);
            res.end();
        }
        user.getScore(usuario, function(err, data) {
            if (err) {
                console.log(err);
                return;
            }
            if (typeof data === 'object' && data != null) {
                let dataFinal=Object.assign(data,utils.weekend())
                res.json(data).end()
            } else {
                res.json({
                    "score": null
                }).end()
            }
            console.log("Resultado score Historico", data);
        })
    }
    static registrar(req, res) {
        var usuario = req.body;
        usuario["score"] = null;
        console.log(usuario);
        user.registrar(usuario, function(tipo, data) {
            if (tipo == 1) {
                res.json({
                    "success": false,
                    "message": "Email ya se encuentra registrado."
                }).end()
            } else if (tipo = 2) {
                res.json({
                    "success": true,
                    "message": "Succesfull!"
                }).end()
            }
        })
    }
}
module.exports = MdpController;