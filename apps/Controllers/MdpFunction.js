var ObjectId = require("mongodb").ObjectId;
var poly = require('@mapbox/polyline');
var endpoint = process.env.endpoint || "http://23.99.181.31:5000/api";
var request = require("request")
var headers=require("./../../config/config.js")["LIBS"]["FIREBASE"]["headers"];
class MdpFunction {

static async filtrarData(req,x){

	console.log( req.body.point.tripId);
	  let andy=[{
            $match: {"tripId": req.body.point.tripId}},
            {$group: {_id: "$time",
            count: {$sum: 1},
            unicoid: {$first: "$_id"},eliminar: {$addToSet: "$_id"}}}, 
            {$match:{count: {$gte: 2}}}, 
            {$project: {final: {$slice: ["$eliminar", 1, "$count"]}}}
            ]

          return new Promise (resolve=>{
          	x.aggregate("TRIP_DATAPOINT",andy,(err,dataFiltro)=>{
          if(err){console.log(err);return;}
             console.log(dataFiltro,789)
             let resol={cli:x,data:dataFiltro,err:err,req:req.body}
              resolve(resol);})  
          })    

} 

static async eliminarDuplicado(x){
  console.log("llego filtrarData",JSON.stringify(x.data));
    
    return new Promise(resolve=>{
    	 x.cli.deleteMany("TRIP_DATAPOINT",{"_id": {"$in": MdpFunction.convertObjectId(x.data)}},(err,go)=>{
                  if(err){console.log(err);return;}

         console.log("Cantidad de points Repitidos eliminados" ,go.deletedCount);
         resolve(x);
                  
    })
   
})
}

static async seleccionarData(x){
	//throw MdpFunction.errorSalida();
  
  return new Promise(resolve=>{
       x.cli.find("TRIP_DATAPOINT", {
                "tripId": x.req.id }, {
                "lat": 1,
                "lon": 1,
                "speed": 1,
                "time": 1,
                "bearing": 1,"ax":1,"ay":1,"az":1,"status":1
            }, function(err, docs) {
                if (err) { console.log(err); return;}
                 console.log("Total Data Consultadas : " + docs.length);
                console.log("Procesado Correctamente      " + x.req.id);
                let dat = {
                    "data": docs
                }
                console.log("CAntidad de POINTS ", dat.data.length);
                console.log(dat.data[0]);
                console.log("ENviando PEticion ............")
                x.data=dat;
                resolve(x);

         })
  })

}


static async enviarModelo(x){
  console.log(x.data);
  return new Promise(resolve=>{
  	    request.post(endpoint, {
                    json: x.data
                }, (error, res, body) => {
                    if (error) {console.log(error);x.cli.close();return;}
                    if (!body.events) {
                        console.log("error", error);
                        console.log(body);
                        return;
                    }
                    console.log("-----------------------LLEGO EN MODELO");
                    console.log("DATA del MODELO ", body)
                    body.events.tripid = x.req.id;
                    body.scores.tripid = x.req.id;

                    x.body=body; 
                    resolve(x);

                })
  })

}


static async actualisarScoreTrip(x){
  
  return new Promise(resolve=>{
    
        let l = x.req.point;
         console.log("VIN ---- ", x.req.id)

    let scoreTrip=Math.round(MdpFunction.scoreTrip(x.body.scores) * 10) / 10;
    x.scoreTrip=scoreTrip;
        x.cli.updateOne("TRIP", {
                                "tripId": x.req.id
                            }, {
                                $set: {
                                    "latEnd": l.lat,
                                    "lonEnd": l.lon,
                                    "timeEnd": l.time,
                                    "duration": x.body.duration,
                                    "distance": x.body.distance,
                                    "completado": true,
                                    "score": scoreTrip,
                                    "scores": x.body.scores,
                                    "events": x.body.events,
                                    "totalPoint": x.data.length,
                                    "polygon": MdpFunction.encodePolyline(x.data)
                                }
                            }, function(err, done) {
                                if (err) {
                                    console.log(err);
                                    return;
                                }


                                resolve(x);
                               })

   })

 } 	

static async getScorePonderado(x){
       let l = x.req.point;
   return new Promise(resolve=>{
  	x.cli.find("TRIP", {
  		"vin": l.vin,
  		"score": {$exists: true,$ne: null}}, {
  		"distance": 1,
  		"score": 1
  	}, (err, datax) => {
  	 console.log(datax);
  	 let scorePonderado=MdpFunction.calcularScoreUser(datax);
  	 console.log("USERID --------->",l.userId)
    x.scorePonderado=scorePonderado;

    resolve(x);

  	})


   })

} 	

static async saveScoreUser(x){
  
  return new Promise(resolve=>{
  	
 x.cli.updateOne("USER", { "_id": new ObjectId(x.req.point.userId) }, {
        $set: {"score": x.scorePonderado}},
         (e, d) => {
         	if (e) {console.log("error update ", e);return;}
         	console.log("TRansaccion Completada");
         	resolve(x);

                                         	 
   

   })
})

}
static async getTokensUser(x){
  
  return new Promise(resolve=>{
  	
     x.cli.find("TOKEN",{"userId":x.req.point.userId},{},(err,tokens)=>{
       console.log(tokens)
       x.data=tokens;
       resolve(x);
   })
})

}
static async sendMessagePush(x){
  
  return new Promise(resolve=>{
  	let mensaje={"registration_ids":MdpFunction.getTokens(x.data) ,"priority": "high",
      "data":{"title":"Completado",
      "body":"Tu viaje se procesó correctamente. Score de: "+ x.scoreTrip,
       "type": 1,
       "score": x.scorePonderado } }
     let option={ "url":'https://fcm.googleapis.com/fcm/send',
                    headers:headers,
                    body:JSON.stringify(mensaje)}
        console.log(mensaje);
        request.post(option, function (error, response, body) {
             if (error) throw new Error(error);
                console.log(body);
              
              })
})

}

  static errorSalida(){
  	 let err = new Error();
       err.name = 'salidaJavier';
      return err;
  }

    static scoreTrip(x) {
        let s = (x.acceleration + x.braking + x.takingCurves + x.speeding) + 10;
        console.log("scoreTrip",s);
        return s;

    }
  static encodePolyline(x) {
        let polyline = [];
        for (let i = 0; x.length > i; i++) {
            if (x[i].lat != 0 || x[i].lon != 0) {
                polyline.push([x[i].lat, x[i].lon]);
            }
        }
        let string = poly.encode(polyline);
        //     console.log("----------------------");
        //    console.log(polurvey.decode(string));
        return string;
    }
static  convertObjectId(x){
   var op =[];
   console.log(x.length);
   for (let i=0;x.length>i;i++) {
       
       for(let b =0;x[i].final.length>b;b++){
        console.log(x[i].final[b]);
        op.push(new ObjectId(x[i].final[b]));
       }
   }

  return op;
   
}

   static getTokens(x){
     let tok =[];

     for(let i =0;x.length>i;i++){
        tok.push(x[i].token);
     }
     return tok;
   }


    static calcularScoreUser(x) {
        let sumapd = 0;
        let sumad = 0;
        for (let i = 0; x.length > i; i++) {
            let m = x[i].distance.split(" ");
            console.log(m);
            sumapd += x[i].score * parseFloat(m[0]);
            /*suma distancia*/
            sumad += parseFloat(m[0]);
        }
        console.log(sumapd, sumad);
        return Math.round((sumapd / sumad) * 10) / 10;
    }





















}

module.exports=MdpFunction;