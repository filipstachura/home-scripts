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

login_multisport();

casper.waitForUrl("https://multisportdiet.pl/pl/profil-uzytkownika/aplikacja-dietmap/moj-plan-zywieniowy", function() {
  console.log("Loaded multisport diet.");
})

casper.thenOpen("https://multisportdiet.pl/pl/profil-uzytkownika/aplikacja-dietmap/lista-zakupow", function() {
  this.echo(this.getTitle());
  var content = this.getPageContent();
  fs.write("DietMap.html", content, 'w');    
});

casper.run(function() {
  this.echo('done').exit();
});
