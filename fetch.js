var request = require('request');
var fs = require('fs');

console.log('Loading data from server...')
request('https://saucelabs.com/docs/browsers/se2'
  , function (err, res, body) {
    if (err) throw err;
    if (res.statusCode != 200) throw new Error('Server responded with status code ' + res.statusCode);

    console.log('Parsing data...')
    body = body.toString().replace(/\_/g, '.').replace(/\'/g, '"');
    var regex = /\"browser\-version\" id=\"([^\-\"]+)\-([^\-\"]+)\-([^\-\"]+)\"/g;
    var nextMatch;
    var raw = [];
    while (nextMatch = regex.exec(body)) {
      //console.log(nextMatch);
      raw.push({os: nextMatch[1], browser: nextMatch[2], version: nextMatch[3] === 'ALL' ? null : nextMatch[3]});
    }

    console.log('Writing data to file "raw.js"...');
    fs.writeFileSync('raw.js', beautify('module.exports = ' + JSON.stringify(raw)));

    console.log('Done!');
  });

function beautify(code) {
  var uglify = require('uglify-js');
  var ast = uglify.parse(code);
  return ast.print_to_string({'beautify': true});
}