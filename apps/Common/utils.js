var ObjectId = require("mongodb").ObjectId;
var poly = require('@mapbox/polyline');
var util = require("util");
const appInsights = require("applicationinsights");
var key = process.env.insigths || "d53c9a1a-bdaf-4f0e-80fe-cb3a16257092";
let moment = require("moment-timezone");
let disableInsigt= process.env.disableinsigth||"true";
appInsights.setup(key).setAutoDependencyCorrelation(true).setAutoCollectRequests(true).setAutoCollectPerformance(true).setAutoCollectExceptions(true).setAutoCollectDependencies(true).setAutoCollectConsole(true).setUseDiskRetryCaching(true).start()
let client = appInsights.defaultClient;
console.log = function() {
    let tiempo = moment().tz('America/Lima').format("YYYY-MM-DD HH:mm:ss.SSSZ");
    process.stdout.write(util.format.apply(this, arguments) + "\n")
    if(disableInsigt=="false"){
        client.trackTrace({
        message: tiempo + "  ---> " + util.format.apply(this, arguments)
    });
    }
    
}
module.exports = {
    isJson: function(str) {
        try {
            var str = str.replace("\t", "");
            str = JSON.parse(str);
            //console.log("JSON");
        } catch (e) {
            //console.log("ERROR: JSON parse");
            return null;
        }
        return str;
    },
    jsonDebug: function(str) {
        try {
            console.log(JSON.stringify(str));
        } catch (e) {
            console.log("ERROR: JSON conversion");
        }
        return null;
    },
    bool2int: function(bool) {
        return bool ? 1 : 0;
    },
    getTimeCurrent:function(){

        return moment().tz('America/Lima').format("YYYY-MM-DD HH:mm:ss");
    },
    validarIdMongo: function(user) {
        return ObjectId.isValid(user);
    },
    convertirIdMongo: function(id) {
        return new ObjectId(id);
    },
    weekend: function() {
        var dayWeek = moment().tz('America/Lima').day();
        var ultimoInicioWeek = moment().tz('America/Lima').subtract(dayWeek, 'day').format("DD/MM");
        let today = moment().tz('America/Lima').format("DD/MM");
        return {
            start: ultimoInicioWeek,
            end: today
        };
    },/*
     weekendtoend: function() {  //del inicio a fin de semana
        var dayWeek = moment().tz('America/Lima').day();
        var ultimoInicioWeek = moment().tz('America/Lima').subtract(dayWeek, 'day').format("DD/MM");
        let today = moment().tz('America/Lima').format("DD/MM");
        return {
            start: ultimoInicioWeek,
            end: today
        };
    },*/
    weekendQuery: function() {
          /*    var dayWeek = moment().tz('America/Lima').day();
        var ultimoInicioWeek = moment().tz('America/Lima').subtract(dayWeek, 'day');
        var endweek = ultimoInicioWeek.clone().add(6,"day").format("YYYY-MM-DDT23:59:59.999-00:00");
        var weekend = ultimoInicioWeek.format("YYYY-MM-DDT00:00:00.000-00:00");
    	*/
        var dayWeek = moment().tz('America/Lima').day();
        var ultimoInicioWeek = moment().tz('America/Lima').subtract(dayWeek, 'day');
        var weekend = ultimoInicioWeek.format("YYYY-MM-DDT00:00:00.000-00:00");
        var today = moment().tz('America/Lima').format("YYYY-MM-DDT23:59:59.999-00:00");
        return {
            start: weekend,
            end: today
        };
    },
    encodePolyline: function(x) {
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
    },
    //Tiempo Semana 
    armarWeeks: function(x) { // el calculo se hara simulando que es la hora de EE.UU 
        let weeks = [];
        var totalWeek = x;
        var dayWeek = moment().tz('America/Lima').day();
        var ultimoInicioWeek = moment().tz('America/Lima').subtract(dayWeek, 'day');
        var weekend = ultimoInicioWeek.format("YYYY-MM-DDT00:00:00.000-00:00");
        //var endweek=ultimoInicioWeek.clone().add(6,"day").format("YYYY-MM-DDT23:59:59.999-00:00");
        //aqui hora actual
         var today = moment().tz('America/Lima').format("YYYY-MM-DDT23:59:59.999-00:00");
        weeks.push({
            desde: weekend,
            hasta: today,
            date: []
        })
        //  console.log("Primer Fecha  " + weekend + " ----- " + today)
        for (let m = 0; totalWeek > m; m++) {
            let time = moment(ultimoInicioWeek)
            let tf = moment(time).subtract(1, 'day').format("YYYY-MM-DDT23:59:59.999-00:00");
            let ti = time.subtract(7, 'day').format("YYYY-MM-DDT00:00:00.000-00:00");
            weeks.push({
                desde: ti,
                hasta: tf,
                date: []
            });
            //    console.log("Primer Fecha  " + ti + " ----- " + tf)
            ultimoInicioWeek.subtract(7, 'day')
        }
        weeks.reverse()
        let query = {
            queryFull: {
                desde: weeks[0].desde,
                hasta: today
            },
            queryBetweenWeeks: weeks
        }
        return query;
        // console.log("Inicio: " + weeks[0].desde + " Fin : " + today)
    },
    particionDayToWeek: function(data, weeks) {
        var tim = [];
        //console.log(moment(inicio).day())
        for (let i = 0; data.length > i; i++) {
            let ti = moment(data[i].timestamp);
            for (let n = 0; weeks.queryBetweenWeeks.length > n; n++) {
                let inicio = moment(weeks.queryBetweenWeeks[n].desde);
                let fin = moment(weeks.queryBetweenWeeks[n].hasta);
                if (ti.isBetween(inicio, fin)) {
                    weeks.queryBetweenWeeks[n].date.push(data[i]);
                }
            }
        }
        // console.log(weeks)
        return weeks;
    },
    getNameMonth:function(x){
        console.log("numero de mes --->",x)
           /*
        if(x!=0){
         x--;
        }*/
        let month=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"]
        return month[x];
    },
    parserCalculate: function(weeks) {
        let dataFinal = []
        let self=this;
        for (let n = 0; weeks.queryBetweenWeeks.length > n; n++) {
            let x = weeks.queryBetweenWeeks[n];
            console.log("dd", moment(x.desde).utc());
            let newData = {
                "label": moment(x.desde).utc().format("DD") + "/" + this.getNameMonth(moment(x.desde).utc().month()) 
            }
            let calculate = null;
            if (x.date.length > 0) {
                calculate = self.calcularScoreUser(x.date);
            }
            newData["score"] = calculate;
            dataFinal.push(newData);
        }
        console.log(dataFinal);
        return dataFinal;
    },
    //Armar Dias
    armarDias: function(x) {
      let today = moment().tz('America/Lima').format("YYYY-MM-DDTHH:mm:ss.000-00:00")
      // let finDia= moment().tz('America/Lima').format("YYYY-MM-DDT23:59:59.999-00:00")
        let inicio = moment().tz('America/Lima').subtract(x, "day").format("YYYY-MM-DDT23:59:59.999-00:00");
        let l = {
            query: {
                desde: inicio,
                hasta: today
            }
        }
        // console.log(inicio, today);
        l["dias"] = this.getDiferencesDay(inicio, today);
        console.log("----------------", l["dias"])
        return l;
    },
    getDiferencesDay: function(startDate, endDate) {
        var dates = [];
        var currDate = moment(startDate).utc().startOf('day');
        var lastDate = moment(endDate).utc().startOf('day');
        dates.push({
            day: currDate.clone().toDate(),
            data: []
        })
        while (currDate.add(1, 'days').diff(lastDate) < 0) {
            //   console.log(currDate.toDate());
            dates.push({
                day: currDate.clone().toDate(),
                data: []
            });
        }
        dates.push({
            day: currDate.clone().toDate(),
            data: []
        })
        // console.log(dates);
        return dates;
    },
    particionDay: function(data, day) {
        var tim = [];
      //  console.log("//////////////////////////////////////////////////////////////////", day)
        //console.log(moment(inicio).day())
        for (let i = 0; data.length > i; i++) {
            for (let n = 0; day.dias.length > n; n++) {
                //  console.log(day.dias[n].day, data[i].fecha)
                if (moment(day.dias[n].day).utc().isSame(data[i].fecha, "day")) {
                    //   console.log("Entro", data[i].data)
                    day.dias[n].data.push(...data[i].data);
                    //   console.log(day.dias[n].data);
                }
            }
        }
        // console.log("day oues", day)
        return day;
    },
    parseDays: function(days) {
        let dataFinal = [];
        let self=this;
        for (let n = 0; days.dias.length > n; n++) {
            let x = days.dias[n];
            console.log("dd", moment(x.day).utc());
            let newData = {
                "label": moment(x.day).utc().format("DD")
            }
            let calculate = null;
            if (x.data.length > 0) {
                calculate =self.calcularScoreUser(x.data);
            }
            newData["score"] = calculate;
            dataFinal.push(newData);
        }
        // console.log(dataFinal);
        return dataFinal;
    },
    //Armar mes
    armarMes: function(x) {
        let today = moment().tz('America/Lima').format("YYYY-MM-DDTHH:mm:ss.000-00:00")
        //moment().endOf(String);
        let inicio = moment().tz('America/Lima').subtract(x, "month").format("YYYY-MM-DDT23:59:59.999-00:00");
        let l = {
            query: {
                desde: inicio,
                hasta: today
            }
        }
        //  console.log(inicio, today);
        l["month"] = this.getDiferencesForMonth(inicio, today);
        return l;
    },
    getDiferencesForMonth: function(startDate, endDate) {
        var dates = [];
        var currDate = moment(startDate).utc().startOf('month');
        var lastDate = moment(endDate).utc().startOf('month');
        dates.push({
            month: currDate.clone().toDate(),
            data: []
        })
        while (currDate.add(1, 'month').diff(lastDate) < 0) {
            console.log(currDate.toDate());
            dates.push({
                month: currDate.clone().toDate(),
                data: []
            });
        }
        dates.push({
            month: currDate.clone().toDate(),
            data: []
        })
        //console.log(dates);
        return dates;
    },
    particionMonth: function(data, month) {
        var tim = [];
        // console.log("//////////////////////////////////////////////////////////////////", month)
        for (let i = 0; data.length > i; i++) {
            for (let n = 0; month.month.length > n; n++) {
                //  console.log(month.month[n].month, data[i].fecha)
                if (moment(month.month[n].month).utc().isSame(data[i].fecha, "month")) {
                    // console.log("Entro", data[i].data)
                    month.month[n].data.push(...data[i].data);
                    //console.log(month.month[n].data);
                }
            }
        }
        // console.log("Meses", month)
        return month;
    },
    parseMonth: function(month) {
    	let self=this;
        let dataFinal = []
        for (let n = 0; month.month.length > n; n++) {
            let x = month.month[n];
            console.log("dd", moment(x.month).utc());
            let newData = {
                "label": this.getNameMonth(parseInt(moment(x.month).utc().month()))+"-"+moment(x.month).utc().format("YYYY")
            }
            let calculate = null;
            if (x.data.length > 0) {
                calculate = self.calcularScoreUser(x.data);
            }
            newData["score"] = calculate;
            dataFinal.push(newData);
        }
        console.log(dataFinal);
        return dataFinal;
    },
    calcularScoreUser: function(x) {
        let sumapd = 0;
        let sumad = 0;
        for (let i = 0; x.length > i; i++) {
            // console.log("distancia",x);
            let m = x[i].distance.split(" ");
            // console.log(m);
            sumapd += x[i].score * parseFloat(m[0]);
            /*suma distancia*/
            sumad += parseFloat(m[0]);
        }
        console.log(sumapd, sumad);
        //Si la sumapd y la sumad son 0 va  asalir un error de NAN
        return Math.round((sumapd / sumad) * 10) / 10;
    }
}