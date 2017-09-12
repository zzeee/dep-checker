'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var https = require("https");

var LibChecker = exports.LibChecker = function () {
    function LibChecker(libname) {
        _classCallCheck(this, LibChecker);

        this.lib = libname;
        this.versions = [];
        this.loaded = 0;
    }

    _createClass(LibChecker, [{
        key: 'load',
        value: function load() {
            var _this = this;

            this._load().then(function (e) {
                _this.versions = e;
                _this.loaded = 1;
            }, new Error('error while loading info'));
        }
    }, {
        key: '_load',
        value: function _load() {
            var _this2 = this;

            return new Promise(function (okres, rej) {
                var qrt = _this2._readLib(_this2.lib).then(function (e) {
                    var rt = _this2._getJson(e);
                    rt.then(function (e) {
                        try {
                            if (e.versions) okres(e.versions);else rej(new Error('no versions'));
                        } catch (ex) {
                            rej(ex);
                        }
                    }, rej);
                }, rej);
            });
        }
    }, {
        key: 'getAllVersions',
        value: function getAllVersions() {
            if (this.loaded !== 1) return false;
            return this.versions;
        }
    }, {
        key: 'getVersionData',
        value: function getVersionData(vers) {
            if (this.loaded !== 1) return false;
            return e.versions[version];
        }
    }, {
        key: 'getLastVersion',
        value: function getLastVersion() {
            if (this.loaded !== 1) return false;
            /* проверить, может просто сделать pop ?*/
            var resarr = [];
            var last = "";
            for (x in this.versions) {
                //resarr.push(x)
                last = x;
            }
            return last;
        }
    }, {
        key: '_readLib',
        value: function _readLib(lib) {
            return new Promise(function (okres, rej) {
                var localAnswer = "";
                var url = "https://registry.npmjs.com/" + lib;
                https.get(url, function (res) {
                    res.on("data", function (e) {
                        localAnswer += e;
                    });
                    res.on("error", function (e) {
                        rej(new Error('error'));
                    });
                    res.on("end", function (e) {
                        okres(localAnswer);
                    });
                }).on("error", rej);
            });
        }
    }, {
        key: '_getJson',
        value: function _getJson(inf) {
            return new Promise(function (ok1res, nokres) {
                try {
                    var jres = JSON.parse(inf);
                    ok1res(jres);
                } catch (ex) {
                    nokres(ex);
                }
            });
        }
    }]);

    return LibChecker;
}();