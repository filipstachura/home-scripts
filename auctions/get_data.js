var casper = require("casper");
var fs = require('fs');

var casper = casper.create({
    pageSettings: {
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:23.0) Gecko/20130404 Firefox/23.0"
    }
});

var url = 'http://www.licytacje.komornik.pl/Notice/Search';

casper.start(url);

casper.waitForSelector('form', function() {
  this.fillSelectors('form', {
    'select[id="Type"]': '1', // Nieruchomość
    'select[id="PropertyCategoryId"]': '30', // Mieszkania
    'input[name="City"]': 'Gdańsk',
  }, true);
  this.echo(JSON.stringify(this.getFormValues('form')));
  this.echo("submitted");
});

casper.waitUntilVisible("table.wMax", function() {
  this.echo("seeing");
}, function() {
  this.echo("time out");
});

get_column = function(casper, nr) {
  return casper.evaluate(function (nr) {
    var selector = 'table tr td:nth-child(' + nr + ')';
    return __utils__.findAll(selector).map(function (e) { return e.innerHTML; });
  }, nr);
}
no_comma = function(x) {
  return x.replace(/,/g, ';');
}
casper.then(function() {
  var name = get_column(this, 5).map(function(x) {
    var m = x.match(/<div>(.*)<\/div>/);
    return m[1];
  }).map(no_comma);
  console.log(name);
  var price = get_column(this, 7).map(function(x) {
    var m = x.replace(/\s\s+/g, ' ').replace("&nbsp;", '');
    return m;
  }).map(no_comma);
  var url = get_column(this, 8).map(function(x) {
    var m = x.match(/href="(.*)"/);
    return "http://www.licytacje.komornik.pl" + m[1];
  });

  data = [name, price, url];
  data = data[0].map(function (col, i) {
    return data.map(function(row) { return row[i];});
  });
});

casper.then(function() {
  var stream = fs.open('export.csv','aw');
  stream.writeLine("name,price,url");
  data.forEach(function(rowArray){
    var row = rowArray.join(",");
    stream.writeLine(row);
  });
  stream.flush();
  stream.close();
});

casper.run(function() {
    this.echo('message sent').exit();
});
