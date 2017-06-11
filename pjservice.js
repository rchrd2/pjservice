/**
 * PJS Service (!)
 *
 * @author Richard Caceres, me@rchrd.net
 *
 */

var server = require('webserver').create(),
    system = require('system'),
    fs = require('fs'),
    webpage = require('webpage');


var DEBUG = false;

if (system.args.length !== 2) {
  console.log('Usage: postserver.js <portnumber>');
  phantom.exit(1);
}

var port = system.args[1];


var service = server.listen(port, function (request, response) {
  console.log('Request received at ' + new Date());
  var return_request = function(result_data, statusCode) {
    response.headers = {
      'Cache': 'no-cache',
      'Content-Type': 'application/json;charset=utf-8'
    };
    response.statusCode = statusCode;
    response.write(result_data);
    response.close();
  };

  /* authenticate */
  if (request.post.token != 'lemons')
    throw "Not authenticated";

  /* validate */
  if (typeof request.post.module != 'string')
    throw "No post module";

  /* parse out define information using a closure */
  module_obj = function(define) {
    return eval(request.post.module);
  }(function (name, deps, callback) {
    /* Adjust args appropriately */
    if (typeof name !== 'string') {
      callback = deps;
      deps = name;
      name = null;
    }
    if ( ! (toString.call(deps) === "[object Array]")) {
      callback = deps;
      deps = [];
    }
    return {
      "name" : "__post_module__" + String(Date.now() /1000 |0),
      "deps" : deps,
      "callback" : callback
    }
  })

  /* validate module */
  var module = module_obj.callback;

  if ( ! (module != null && typeof module === 'object'))
    throw "Module is not an object";
  if ( ! (typeof module.url === 'string'))
    throw "Module does not contain url";
  if (typeof module.scraper === 'undefined')
    throw "Module does not contain scraper";
  if (typeof module.disable === 'boolean' && module.disable == true)
    throw "Module is disabled";

  try {
    var page = webpage.create();
    page.open(module.url, function(status) {
      page.injectJs('./client/bootstrap.js');
      var result_data = page.evaluate(module.scraper);
      var json_data = JSON.stringify(result_data, null, 2);
      return_request(json_data, 200);
    });
  } catch (e) {
    return_request({error: e}, 500);
  }

});
