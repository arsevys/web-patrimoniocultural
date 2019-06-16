var dao = require("./dao/Api");

class ApiModel {

    static inicio(x,callback){
       dao.inicio(x,function(err,data){
           if(err){
               console.log(err);
               
           }
           callback(err,data);
       })
        
    }
    static lista(x,callback){
    	dao.lista(x,function(e,data){
        callback(data);
    	})
    }
    static listatime(x,callback){
    	dao.listatime(x,function(e,data){
        callback(data);
    	})
    }
    static registrar(x,callback){
    	dao.registrar(x,function(e,data){
        callback(data);
    	})
    }
     static update(id,x,callback){
    	dao.update(id,x,function(e,data){
        callback(data);
    	})
    }
}
module.exports = ApiModel;