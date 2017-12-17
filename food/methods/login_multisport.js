var fs = require('fs');
var password = fs.read('.multisport.pass');

login_multisport = function() {
  var start_url = 'https://www.kartamultisport.pl/loginsu/?callback=https://multisportdiet.pl/pl/';

  casper.start(start_url);
  casper.waitForSelector('form', function() {
    this.fillSelectors('form', {
      'input[name="tx_benefitattractionfeuser_login[username]"]': 'fylyps@gmail.com',
      'input[name="tx_benefitattractionfeuser_login[password]"]': password
    }, true);
    this.echo("submitted");
  });
}
