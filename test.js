// to run these tests:
//   npm install
//   npm test

var assert = require('better-assert');
var fetch = require('./fetch');
var browsers;

describe('fetch', function () {
  it('retrieves and parses data from the server', function (done) {
    this.timeout(30000);
    this.slow(15000);
    fetch(done);
  });
  it('saves the data as a module to a file', function () {
    browsers = require('./raw');
  });
});

describe('raw data', function () {
  it('is an array of items', function () {
    assert(Array.isArray(browsers));
  });
  describe('each item', function () {
    it('is an object', function () {
      browsers.forEach(function (browser) {
        assert(browser && typeof browser === 'object' && !Array.isArray(browser));
      });
    });
    it('has `platform`, `browserName` and `version` properties, each of which are strings or null', function () {
      browsers.forEach(function (browser) {
        assert(browser.platform && typeof browser.platform === 'string');
        assert(browser.browserName && typeof browser.browserName === 'string');
        assert(browser.version === null || (browser.version && typeof browser.version === 'string'));
      });
    });
  });
});

describe('exports', function () {
  var browsers;
  var expectedBrowsers = ['opera', 'internet explorer', 'firefox', 'safari', 
                          'chrome', 'ipad', 'iphone', 'android'];
  it('is an object with a property for each browser', function () {
    browsers = require('./');
    assert(typeof browsers === 'object');
    Object.keys(browsers).forEach(function (browser) {
      assert(~expectedBrowsers.indexOf(browser));
    });
    expectedBrowsers.forEach(function (browser) {
      assert(browsers[browser]);
    });
  });
  describe('each browser', function () {
    it('is represented by an array of configurations', function () {
      Object.keys(browsers).forEach(function (browser) {
        assert(Array.isArray(browsers[browser]));
      });
    });
    it('is sorted by version number', function () {
      Object.keys(browsers).forEach(function (browser) {
        var a = browsers[browser];
        a.reduce(function (a, b) {
          assert(a.version === b.version || a.version === null || (+a.version) > (+b.version));
          return b;
        });
      });
    });
    describe('each configuration', function () {
      it('has a toString method that returns a human readable string', function () {
        Object.keys(browsers).forEach(function (browser) {
          browsers[browser].forEach(function (configuration) {
            assert(typeof configuration.toString() === 'string');
            assert(configuration.toString() != Object.prototype.toString.call(configuration));
          });
        });
      });
      it('has an osType method that returns the type of operating system', function () {
        Object.keys(browsers).forEach(function (browser) {
          browsers[browser].forEach(function (configuration) {
            assert(typeof configuration.osType() === 'string');
            assert(configuration.osType() === 'Windows' || configuration.osType() === 'Linux' || configuration.osType() === 'Mac');
          });
        });
      });
      it('has an toURL method that returns a url safe full-name', function () {
        Object.keys(browsers).forEach(function (browser) {
          browsers[browser].forEach(function (configuration) {
            assert(typeof configuration.toURL() === 'string');
            assert(configuration.toURL() === configuration.toURL().toLowerCase());
          });
        });
      });
      it('has `platform`, `browserName` and `version` properties, each of which are strings or null', function () {
        Object.keys(browsers).forEach(function (browser) {
          browsers[browser].forEach(function (configuration) {
            assert(configuration.platform && typeof configuration.platform === 'string');
            assert(configuration.browserName && typeof configuration.browserName === 'string');
            assert(configuration.version === null || (configuration.version && typeof configuration.version === 'string'));
          });
        });
      });
    });
  });
});