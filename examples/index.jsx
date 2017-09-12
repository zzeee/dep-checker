var dchecker=require("dep-checker");
var fs=require("fs");
var bodyParser = require("body-parser")
var express=require("express");
let app = express();

app.use(bodyParser.urlencoded());

//app.use(bodyParser.urlencoded({ extended: false }))


function getDepComp(packstr)
{
    return new Promise((okres, rej) => {
        try
        {
        let rdata = dchecker.getLibListFromJson(reqdat);
        let ininc=0;
        for (x in rdata) ininc++;
        let alllib = [];
        let countlib = 0;
        let res="";
        res+="<table border=\"1\">";
        for (x in rdata) {
            let qline = rdata[x];
            let lline = x;
            console.log(x);
            let rt = new dchecker.LibChecker(x).then((e) => {
                res+="<tr><td>" + lline + "</td><td>" + qline + "</td><td>" + e["latest"] + "</td></tr>";
                countlib++;
                if (countlib == ininc) {
                    res+="</table>";

                    okres(res);
                }
            }, rej);
        }
    }
    catch (ex){rej(ex)}
    });
}



app.get('/', function (req, res) {
    res.send('<h1>Запостите package.json</h1><form method="POST" enctype="multipart-form/data" action="/"><textarea cols="40" rows="30" name="nam"></textarea><br /><button  type="submit" >Отправить</button></form>');
});

app.post('/', function (req, res) {
    let ="";
    reqdat=req.body.nam;
    let ininc=0;
    getDepComp(reqdat).then((e)=>res.send(e), console.log);
});


let port=3000;
app.listen(port, function () {
    console.log(`${port}!`);
});
