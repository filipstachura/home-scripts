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

casper.run(function() {
  this.echo('done').exit();
});
