var casper = require("casper");
var fs = require('fs');
var utils = require('utils');

var password = fs.read('.piotripawel.pass');
var basket = fs.read('basket.csv');

var parse_basket = function(basket) {
  var products = basket.split("\n")
    .map(function(x) {
      return x.split(",");
    })
    .filter(function(x) {
      return (x.length == 2);
    })
    .slice(1)
    .map(function(x) {
      return {
        name: x[0],
        grams: x[1]
      }
    })
  return products;
}

var products = parse_basket(basket);

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
  this.echo("Logging in");
});

casper.waitForSelectorTextChange('.logged', function() {
  var text = this.evaluate(function() {
    return $('li.logged > a[href="/klient/szczegoly"]').html();
  })
  console.log("Logged in: " + text);
}, function() {console.log("time out")}, 20000 );

add_to_cart_product = function(product) {
  casper.waitForSelector('.FormSzukaj', function() {
    console.log("Searching for: " + product)
    this.fillSelectors('.FormSzukaj', {
      'input[name="query"]': product,
    }, true);
  })

  casper.waitForSelector('#searchbar-summary', function() {
    console.log("Search results visible");
    this.click('.center_column .add-to-cart');
    console.log("added");
  })
}

products
  .map(function(product) {
    add_to_cart_product(product.name);
  })

casper.run(function() {
  this.echo('done').exit();
});
