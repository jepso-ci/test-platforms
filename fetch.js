var request = require('request');
var fs = require('fs');
var debug = require('debug')('test-platforms:fetch');

module.exports = fetch;

function fetch(cb) {
  debug('Loading data from server...')
  request('https://saucelabs.com/docs/browsers/se2'
    , function (err, res, body) {
      if (err) return cb(err);
      if (res.statusCode != 200) return cb(new Error('Server responded with status code ' + res.statusCode));

      debug('Parsing data...')
      var browserString;
      var raw = [];
      body = body.toString().replace(/\_/g, '.').replace(/\'/g, '"');
      body = body.split('browser-string caps');
      for (var i = 0; i < body.length; i++) {
        if (browserString = /strings\=\"([^\"]*)\"/.exec(body[i]))
          parseSection(browserString[1], body[i], raw);
      };

      debug('Writing data to file "raw.js"...');
      fs.writeFileSync('raw.js', beautify('module.exports = ' + JSON.stringify(raw)));
      debug('Done!');
      cb();
    });
}
function beautify(code) {
  var uglify = require('uglify-js');
  var ast = uglify.parse(code);
  return ast.print_to_string({'beautify': true});
}

function parseSection(browserString, body, raw) {
  var regex = /\"browser\-version\" id=\"([^\-\"]+)\-([^\-\"]+)\-([^\-\"]+)\"/g;
  var nextMatch;
  while (nextMatch = regex.exec(body)) {
    //console.log(nextMatch);
    raw.push({platform: nextMatch[1], browserName: browserString, version: nextMatch[3] === 'ALL' ? null : nextMatch[3]});
  }
}