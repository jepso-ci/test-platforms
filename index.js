//process.exit(0);
var raw = require('./raw').map(function (s) { return new Spec(s); });

var emulated = ['ipad', 'iphone', 'android'];

function Spec(spec) {
  this.os = spec.os;
  this.browser = spec.browser;
  this.version = spec.version;
}

Spec.prototype.toString = function () {
  if (this.version === null) return this.browser + ' running on ' + this.os;
  for (var i = 0; i < emulated.length; i++) {
    if (emulated[i] == this.browser) {
      return this.browser + ' emulator version ' + this.version + ' running on ' + this.os;
    }
  }
  return this.browser + ' version ' + this.version + ' running on ' + this.os;
};
var win = /Windows/;
var lin = /Linux/;
var mac = /Mac/;
Spec.prototype.osType = function () {
  if (win.test(this.os)) return 'Windows';
  if (lin.test(this.os)) return 'Linux';
  if (mac.test(this.os)) return 'Mac';
};

var browsers = exports;

raw.forEach(function (spec) {
  browsers[spec.browser] = browsers[spec.browser] || [];
  browsers[spec.browser].push(spec);
});

//sort browsers from highest to lowest version number
Object.keys(browsers).forEach(function (browser) {
  browsers[browser] = browsers[browser]
    .sort(function (a, b) {
      if (a.version === b.version) {
        return 0;
      }
      if (a.version === null) return -1;
      if (b.version === null) return 1;
      a = +a.version;
      b = +b.version;
      return b - a;
    });
});