var fs = require('fs');
var password = fs.read('.piotripawel.pass');

login_piotripawel = function() {
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
}
