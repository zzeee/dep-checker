const https = require("https");

export class LibChecker {
    constructor(libname) {
        this.lib = libname;
        this.versions = [];
        return new Promise((ok, nok) => {
            this.loading = this._load().then((e) => {
                this.versions = e;
                let result = [];
                result["all"] = e;
                for (var y in e) result["latest"] = y; //TODO - сделать выбор по критериям
                ok(result);
            });
        });
    }

    _load() {
        return new Promise((okres, rej) => {
            let qrt = this._readLib(this.lib).then((e) => {
                let rt = this._getJson(e);
                rt.then((e) => {
                    try {
                        if (e.versions) okres(e.versions);
                        else rej(new Error('no versions'));
                    }
                    catch (ex) {
                        rej(ex)
                    }
                }, rej);
            }, rej);
        });
    }

    _readLib(lib) {
        return new Promise((okres, rej) => {
            let localAnswer = "";
            let url = "https://registry.npmjs.com/" + lib;
            https.get(url, (res) => {
                res.on("data", e => {
                    localAnswer += e;
                });
                res.on("error", (e) => {
                    rej(new Error('error'))
                });
                res.on("end", (e) => {
                    okres(localAnswer);
                });

            }).on("error", rej);
        });
    }

    _getJson(inf) {
        return new Promise((ok1res, nokres) => {
            try {
                let jres = JSON.parse(inf);
                ok1res(jres);
            }
            catch (ex) {
                nokres(ex);
            }
        });
    }

}

export function getLibListFromJson(rtext) {
    try {

        let parsed = JSON.parse(rtext);
        let resarr = [];
        if (parsed && parsed.dependencies) {
            let qrt = parsed.dependencies;
            return qrt;
//                for (x in qrt) {
            //                  resarr[x] = qrt[x];
            //            }
        }
    }
    catch (ex) {
        throw(ex);
    }
    return false;
}
