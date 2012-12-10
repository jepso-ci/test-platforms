 var request = require('request');
var fs = require('fs');

console.log('Loading data from server...')
request('https://saucelabs.com/docs/browsers/se2'
  , function (err, res, body) {
    if (err) throw err;
    if (res.statusCode != 200) throw new Error('Server responded with status code ' + res.statusCode);

    console.log('Parsing data...')
    var browserString;
    var raw = [];
    body = body.toString().replace(/\_/g, '.').replace(/\'/g, '"');
    body = body.split('browser-string caps');
    for (var i = 0; i < body.length; i++) {
      if (browserString = /strings\=\"([^\"]*)\"/.exec(body[i]))
        parseSection(browserString[1], body[i], raw);
    };

    console.log('Writing data to file "raw.js"...');
    fs.writeFileSync('raw.js', beautify('module.exports = ' + JSON.stringify(raw)));

    console.log('Done!');
  });

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