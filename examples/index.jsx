var dchecker=require("dep-checker");
var fs=require("fs");
var bodyParser = require('body-parser')
var app=require("express");

app.use(bodyParser.urlencoded({ extended: false }))



app.get('/', function (req, res) {
    res.send('<h1>Запостите package.json</h1><form method="POST" enctype="multipart-form/data" action="/"><textarea cols="40" rows="30" name="nam"></textarea><br /><button  type="submit" >Отправить</button></form>');
});

app.post('/', function (req, res) {
    let ="";
    reqdat=req.body.nam;
    let ininc=0;
    let rdata=dchecker.getLibListFromJson(reqdat);

    for(x in rdata) ininc++;
    console.log(ininc);
    let alllib=[];
    let countlib=0;
    for (x in rdata)
    {
        let lline=x;
        let qline=rdata[x];

        let rt=new checker.LibChecker(x).then((e)=>{
            e["latest"];
            aline=[];
            aline[lline]=e;
            console.log(lline,qline,e);
            countlib++;
            if (countlib==ininc) {
                console.log("RT",alllib, JSON.stringify(alllib), JSON.stringify(aline));
                res.end();
            }

        },console.log);

    }
//console.log(alllib, alllib.length);
//res.end();
});

let port=3000;
app.listen(port, function () {
    console.log(`${port}!`);
});
