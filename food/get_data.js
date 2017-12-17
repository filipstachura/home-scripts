var casper = require("casper");
var fs = require('fs');
var utils = require('utils');

var password = fs.read('.multisport.pass');

var casper = casper.create({
    pageSettings: {
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:23.0) Gecko/20130404 Firefox/23.0"
    }
});

var args = casper.cli.args;
var DEBUG = args[0];

if (DEBUG) {
  console.log("==== DEBUG MODE ====")
  casper.on('remote.message', function(msg) {
    this.echo('remote message caught: ' + msg);
  })
}

var base_url = 'https://multisportdiet.pl';
var start_url = 'https://www.kartamultisport.pl/loginsu/?callback=https://multisportdiet.pl/pl/';

casper.start(start_url);
casper.waitForSelector('form', function() {
  this.fillSelectors('form', {
    'input[name="tx_benefitattractionfeuser_login[username]"]': 'fylyps@gmail.com',
    'input[name="tx_benefitattractionfeuser_login[password]"]': password
  }, true);
  this.echo("submitted");
});

casper.waitForSelector('a.lock-screen.kslider-next', function() {
  this.click('a.lock-screen.kslider-next');
})

var get_nutritional_plan = function() {
  var extract_ingredient = function(i, elem) {
    return {
      name: $(elem).find('.meal-title').text()
    };
  };

  return $('.plan-box').map(function(i, elem) {
    return {
      title: $(elem).find('div.text-type-2').html(),
      ingredients: $(elem).find('.plan-meals li').map(extract_ingredient).toArray(),
      recipe_url: $(elem).find('a.fancybox-iframe-wide').attr('href')
    };
  }).toArray().filter(function(x) {return 'title' in x && x.title;});
};

var clear_text = function(x) {
  return x.replace(/&nbsp;/g, ' ').replace(/\s\s+/g, ' ');
};

var clean_ingredient = function(ingredient) {
  ingredient.name = clear_text(ingredient.name);
  return ingredient;
};

var clean_meal = function(plan) {
  plan.title = clear_text(plan.title);
  plan.ingredients = plan.ingredients.map(clean_ingredient);
  return plan;
};

var get_recipe = function(meal, url) {
  console.log("loading recipe: " + url);
  casper.thenOpen(url, function() {
    casper.waitForSelector('.single-recipe-simple', function() {
      console.log("loaded recipe: " + url);
      meal.recipe = this.evaluate(function() {
        var content = $('.iframe > .single-recipe-simple').html();
        return content;
      }).replace(/\/cache\/images/g, 'https://multisportdiet.pl/cache/images');
    }, null, 10000);
  })
}

casper.waitUntilVisible(".nutritional-plan", function() {
  plan = this.evaluate(get_nutritional_plan)
    .map(clean_meal)
    .map(function (meal) {
      if (meal.recipe_url) {
        var url = base_url + meal.recipe_url;
        get_recipe(meal, url);
        delete meal.recipe_url;
      }
      return meal;
    });
}, function() {
  this.echo("time out");
}, 10000);

casper.run(function() {
  var filename = 'plan.json';
  fs.write(filename, JSON.stringify(plan), 'w');
  this.echo(filename + " saved");
  this.echo('done').exit();
});
