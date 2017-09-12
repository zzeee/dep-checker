var dchecker = require("dep-checker");
var fs = require("fs");
var bodyParser = require("body-parser")
var express = require("express");
var htmlConvert = require('html-convert');
var path = require('path');
var fs = require('fs');
var os = require('os');

var convert = htmlConvert({"width":400,"height":200});
var tmpdir= path.join(fs.existsSync('/tmp') ? '/tmp' : os.tmpDir(), 'dep-checker');


let app = express();
app.use(bodyParser.urlencoded());

function generateUUID () { // Public Domain/MIT
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}


function getDepCompHtml(packstr) {
    return new Promise((okres, rej) => {
        try {
            let rdata = dchecker.getLibListFromJson(packstr);
            let ininc = 0;
            for (x in rdata) ininc++;
            let alllib = [];
            let countlib = 0;
            let res = "";
            res += "<table border=\"1\">";
            for (x in rdata) {
                let v1 = rdata[x];
                let lline = x;
                let rt = new dchecker.LibChecker(x).then((e) => {
                    let v2 = e["latest"];
                    let color = "color:white; background:green";
                    if (v1.substring(v1.lastIndexOf('.') + 1, v1.length) !== v2.substring(v2.lastIndexOf('.') + 1, v2.length)) {
                        color = "";
                    }
                    if (v1.substring(1, v1.indexOf('.')) !== v2.substring(0, v2.indexOf('.'))) {
                        color = "color:white; background:red";
                    }
                    res += "<tr style='" + color + "'><td>" + lline + "</td><td>" + v1 + "</td><td>" + v2 + "</td></tr>";
                    countlib++;
                    if (countlib == ininc) {
                        res += "</table>";
                        okres(res);
                    }
                }, rej);
            }
        }
        catch (ex) {
            rej(ex)
        }
    });
}

const enterscr = '<h1>Запостите package.json</h1><form method="POST" enctype="multipart-form/data" action="/"><textarea cols="40" rows="30" name="nam"></textarea><br /><button  type="submit" >Отправить</button></form>';

app.get('/', function (req, res) {
    res.send(enterscr);
});

app.post('/', function (req, res) {
    let reqdat = req.body.nam;
    let ininc = 0;
    getDepCompHtml(reqdat).then((e) => {
        let uuid=generateUUID();
        fs.writeFileSync(tmpdir+uuid+".html",e);
        res.writeHead(200,{'content-type':'text/html'});
        res.write(e);
        res.write("<h2>Image: </h2>");
        res.write("<img  src='/getpic/"+uuid+"' />");
        res.end();

    }, (e) => res.send(`<h1>Произошла ошибка: </h1><br />${e}<br />` + enterscr));
});

app.get('/getpic/:guid', function (req, res) {
    let fname = tmpdir + req.params.guid + ".html";
    try {
        if (fs.existsSync(fname)) {
                fs.createReadStream(fname)
                    .pipe(convert({format:'png', quality: 100, width: 300}))
                    .pipe(res);
        }
        }
    catch (ex) {
        console.log(ex)
    }
});


let port = 3000;
app.listen(port, function () {
    console.log(`Started using port ${port}!`);
});
