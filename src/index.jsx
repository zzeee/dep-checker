const https = require("https");

export class LibChecker {
    constructor(libname) {
        this.lib = libname;
        this.versions = [];
        this.loaded = 0;
    }

    load() {
        this.loading=_load();
        this.loaded=-1;
        this.loading.then((e) => {
            this.versions = e;
            this.loaded = 1;
        }, new Error('error while loading info'));

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

    getAllVersions() {
        if (this.loaded !== 1) return false;
        return this.versions;
    }

    getVersionData(vers) {
        if (this.loaded !== 1) return false;
        return e.versions[version];
    }

    getLastVersion() {
        if (this.loaded !== 1) return false;
        /* проверить, может просто сделать pop ?*/
        let resarr = []
        let last = "";
        for (x in this.versions) {
            //resarr.push(x)
            last = x;
        }
        return last;
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