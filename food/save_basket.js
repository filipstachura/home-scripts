var casper = require("casper");
var fs = require('fs');
var utils = require('utils');
require('./methods/login_multisport.js');

var casper = casper.create({
    pageSettings: {
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:23.0) Gecko/20130404 Firefox/23.0"
    }
});
casper.options.waitTimeout = 20000;

var args = casper.cli.args;

var date_from = args[0];
var date_to = args[1];

if (!date_from || !date_to) {
  console.error("Please provide date range in format '2017-12-18' '2017-12-22'");
  throw "Date range not provided";
}
console.log(date_from);
console.log(date_to);

login_multisport();

casper.waitForUrl("https://multisportdiet.pl/pl/profil-uzytkownika/aplikacja-dietmap/moj-plan-zywieniowy", function() {
  console.log("Loaded multisport diet.");
})

casper.thenOpen("https://multisportdiet.pl/pl/profil-uzytkownika/aplikacja-dietmap/lista-zakupow");

casper.waitForSelector("form.select-day-form", function() {
  this.fillSelectors("form.select-day-form", {
    'select[name="d_from"]': date_from,
    'select[name="d_to"]': date_to
  }, true);
  this.echo("Selecting dates");
});

casper.waitForSelector(".nutritional-plan", function() {
  var content = this.getPageContent();
  fs.write("DietMap.html", content, 'w');
});

casper.run(function() {
  this.echo('done').exit();
});
