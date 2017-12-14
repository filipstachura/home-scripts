var casper = require("casper");
var fs = require('fs');
var utils = require('utils');


var password = fs.read('.piotripawel.pass');

var casper = casper.create({
    pageSettings: {
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:23.0) Gecko/20130404 Firefox/23.0"
    }
});
casper.options.waitTimeout = 20000;

casper.on('remote.message', function(msg) {
  this.echo('remote message caught: ' + msg);
})

var start_url = 'https://m.e-piotripawel.pl/';

casper.start(start_url);
casper.waitForSelector('#login-form', function() {
  this.fillSelectors('form#login-form', {
    'input[name="StoreLoginForm[username]"]': 'kw_kamila',
    'input[name="StoreLoginForm[password]"]': password
  }, true);
  this.echo("submitted");
});

casper.waitForSelectorTextChange('.logged', function() {
  var text = this.evaluate(function() {
    return $('li.logged > a[href="/klient/szczegoly"]').html();
  })
  console.log("Logged in: " + text);
}, function() {console.log("time out")}, 20000 );

casper.then(function() {
  console.log(this.getPageContent());
})

casper.waitForSelector('#FormSzukaj', function() {
  console.log("searching")
  this.fillSelectors('#FormSzukaj', {
    'input[name="query"]': 'ogórek',
  }, true);
  this.click('.center_column .add-to-cart');
})

casper.run(function() {
  this.echo('done').exit();
});
