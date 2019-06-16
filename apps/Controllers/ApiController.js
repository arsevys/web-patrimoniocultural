var api = require("./../Models/ApiModel");
//var utils = require("./../Common/utils");
var data ={
  "0" :{   id:"0",
     titulo:"Chan Chan, la ciudad de barro más grande del mundo",
      banner:"./img/banchan.jpg",
      foto:"./img/chanchan.jpg",
      descri:"En la costa norte del Perú, sobre el valle de Moche, se erige una impresionante ciudadela hecha de adobe que es considerada patrimonio Cultural de la Humanidad: Chan Chan. Este milenario atractivo turístico se encuentra ubicado a 5 km de la Ciudad de Trujillo, en La Libertad, expandiéndose en un amplio territorio de unos 20 km2."
    }

,


"1" :{  id:"1",
     titulo:"Prebistero Maestro, primer camposanto de la ciudad de Lima",
      banner:"./img/banprevis.jpg",
      foto:"./img/prebis.jpg",
      descri:"Inaugurado en 1808 por el Virrey Abascal, el autor de sus planos fue el conocido alarife español el presbítero Matías Maestro. Conserva más de 766 mausoleos de estilo neoclásico, en los que destacan estatuas y esculturas inspiradas en figuras de santos y las virtudes teologales."
    }
,

"2" :{  id:"2",
     titulo:"Centro Historico de Lima",
      banner:"./img/bancentro.jpg",
      foto:"./img/centro.jpg",
      descri:"Lima fue la metrópoli más importante y poderosa de Latinoamérica gracias a su ubicación, diversidad natural y riqueza cultural, actualmente exhibida en sus museos, barrios tradicionales y galerías artesanales. La característica peculiar del Centro Histórico de Lima son sus populares balcones, edificaciones que representan dos épocas, como la colonial y la republicana."
    }

}



class ApiController {
    static init(req, res) {
        res.status(200).end();
    }
    static inicial(req, res) {
        // res.status(200).end();

        res.render("index.ejs")
    }
    static menulugar(req, res) {
        // res.status(200).end();

        res.render("menulugar.ejs")
    }
     static lugar(req, res) {
        // res.status(200).end();
  console.log(req.query)
        res.render("timeline.ejs",{data:data[req.query.id]})
    }
     static menu(req, res) {
        // res.status(200).end();

        res.render("menu.ejs")
    }
     static registrar(req, res) {

         req.body.ide=Math.random() + "";

      
         api.registrar(req.body,function(){

         });
        res.json({}).end();

    }
    static inicio(req, res) {
        let x = req.body;
        console.log(usuario);
        api.inicio(x, function(err, data) {
            if (err) {
                res.json({
                    message: "Error en el servicio!!!!"
                }).end();
                return;
            }
            res.json(data).end();
        })
    }
  /*
    0 -- nuevo 
    1 --aceptado 
    2 --rechazado

  */
    static listanew(req,res){
        api.lista("0",function(d){
           // console.log(d)
            res.json(d).end();
        })
    }

    static listatime(req,res){
      console.log(req.body)
        api.listatime(req.body.id,function(d){
           // console.log(d)
            res.json(d).end();
        })
    }

     static bien(req,res){
        api.update(req.body.id,"1",function(d){
            console.log(d)
            res.sendStatus(200);
        })
    }
    static mal(req,res){
        api.update(req.body.id,"2",function(d){
            console.log(d)
            res.json(d).end();
        })
    }
}
module.exports = ApiController;