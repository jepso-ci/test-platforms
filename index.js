var raw = require('./raw').map(function (s) { return new Spec(s); });

var emulated = ['ipad', 'iphone', 'android'];

function Spec(spec) {
  this.platform = spec.platform;
  this.browserName = spec.browserName;
  this.version = spec.version;
}

Spec.prototype.toString = function () {
  var browser = this.browserName;
  var os = this.platform;
  var version = this.version;

  if (version === null) return browser + ' running on ' + os;
  for (var i = 0; i < emulated.length; i++) {
    if (emulated[i] == browser) {
      return browser + ' emulator version ' + version + ' running on ' + os;
    }
  }
  return browser + ' version ' + version + ' running on ' + os;
};
var win = /Windows/;
var lin = /Linux/;
var mac = /Mac/;
Spec.prototype.osType = function () {
  if (win.test(this.platform)) return 'Windows';
  if (lin.test(this.platform)) return 'Linux';
  if (mac.test(this.platform)) return 'Mac';
};

Spec.prototype.toURL = function () {
  var parts = [];
  if (this.browserName) parts.push(urlSafe(this.browserName));
  if (this.version) parts.push(urlSafe(this.version));
  if (this.platform) parts.push(urlSafe(this.platform));
  return parts.join('/');
}

function urlSafe(text) {
  text = text.toLowerCase();
  return text.replace(/[ \/\\\?\.]/g, '-');
}

var browsers = exports;

raw.forEach(function (spec) {
  browsers[spec.browserName] = browsers[spec.browserName] || [];
  browsers[spec.browserName].push(spec);
});

//sort browsers from highest to lowest version number
Object.keys(browsers).forEach(function (browserName) {
  browsers[browserName] = browsers[browserName]
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