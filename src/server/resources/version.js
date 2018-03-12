var fs = require('fs');
var xml2js = require('xml2js');

var parser = new xml2js.Parser();
var builder = new xml2js.Builder();

var xml = fs.readFileSync('./pom.xml', 'utf8');

parser.parseString(xml, function(err, result) {
  var version = result.project.version[0];
  if (version.indexOf('RC') != -1) {
    var sp = version.indexOf('RC') != -1 ? 'RC' : 'SNAPSHOT';
    var p = version.split(sp);
    var v = parseInt(p[1]) + 1;
    var n = p[0] + sp + (v < 10 ? '0' + v : v);

    result.project.version[0] = n;
    var target = builder.buildObject(result);

    fs.writeFileSync('./pom.xml', target);
  }
});
