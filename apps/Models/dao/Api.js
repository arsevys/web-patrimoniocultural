//var bd = require("./../../Common/database/mongodb")
//var utils = require("./../../Common/utils");
const db = require('./../../Common/database/pgdb');
class Api {
    static inicio(user, callback) {
     

     callback(false,user);
    }
   
   static registrar(x,callback){
     let query = "insert into timeline(fotos,asunto,descri,fecha,estado,ide_sitio)  values($1,$2,$3,$4,$5,$6)";
        let params = [x.fotos,x.asunto,x.descri,x.fecha,"0",x.ide_sitio];
        db.query(query, params, (err, data) => {
            if (err) {
                console.error(err);
                return callback(true, null);
            } else {
                return callback(false, data.rows);
            }
        })
   }

   static lista(x,callback){
     let query = "select * from timeline  where estado = $1";
        let params = [x];
       // console.log(query)
        db.query(query, params, (err, data) => {
            if (err) {
                console.error(err);
                return callback(true, null);
            } else {
                return callback(false, data.rows);
            }
        })

   }

    static listatime(x,callback){
     let query = "select * from timeline  where estado='1' and ide_sitio= $1";
        let params = [x];
        console.log(query,params)
        db.query(query, params, (err, data) => {
            if (err) {
                console.error(err);
                return callback(true, null);
            } else {
                return callback(false, data.rows);
            }
        })

   }

   static update(id,x,callback){
     let query = "update  timeline  set estado=$1 where id = $2";
        let params = [x,id];
        console.log(query)
        db.query(query, params, (err, data) => {
            if (err) {
                console.error(err);
                return callback(true, null);
            } else {
                return callback(false, []);
            }
        })

   }



}
module.exports = Api;