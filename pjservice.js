/**
 * PJS Service (!)
 *
 * @author Richard Caceres, me@rchrd.net
 *
 */

var server = require('webserver').create(),
    system = require('system'),
    fs = require('fs');


var DEBUG = false;

if(system.args.length !== 2) {
    console.log('Usage: postserver.js <portnumber>');
    phantom.exit(1);
}

var port = system.args[1];


service = server.listen(port, function (request, response) {
    console.log('Request received at ' + new Date());

    var result_data = null;

    var return_request = function(result_data, statusCode) {
        //console.log('return_request');
        // if (!response) { console.log('no response'); return; } // hack to prevent accidently calling again
        response.headers = {
            'Cache': 'no-cache',
            'Content-Type': 'text/plain;charset=utf-8'
        };
        response.statusCode = statusCode;
        response.write(result_data);
        response.close();
    };


    /* authenticate */
    if(request.post.token != 'lemons') {
        throw "Not authenticated";
    }

    /* validate */
    if(typeof request.post.module != 'string') {
        throw "No post module";
    }

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

    if( ! (module != null && typeof module === 'object')) {
        throw "Module is not an object";
    }

    if( ! (typeof module.url === 'string')) {
        throw "Module does not contain url";
    }

    if(typeof module.scraper === 'undefined') {
        throw "Module does not contain scraper";
    }

    if(typeof module.disable === 'boolean' && module.disable == true) {
        throw "Module is disabled";
    }


    /* create a temporary file to hold store scrape result */
    var temp_filename = fs.workingDirectory + '/tmp/out-' + system.pid + '-' + String(Date.now() /1000 |0) +'.json';
    fs.touch(temp_filename);

    /* Now we finally execute our scraper */
    var pjs = require(fs.workingDirectory + '/pjscrape/pjsmodulep.js').pjs();
    pjs.config({
        log: DEBUG == true ? 'base' : 'none',
        timeoutInterval: 30,
        writer: 'file',
        outFile: temp_filename,
        noConflict: false, // no conflict is false
        debug: DEBUG,
        complete: function(arg) {
          // console.log('complete');
          // console.log(arg);
          result_data = fs.read(temp_filename);
          /* remove temporary filename */
          fs.remove(temp_filename);
          return_request(result_data, 200);
        },
    });

    pjs.addSuite({
        url: module.url,
        scraper: module.scraper,
    });

    try {
      pjs.init();
    } catch (err) {
        console.log("CAUGHT ERROR: " + err);
        /* remove temporary filename */
        if (fs.existsSync(temp_filename)) {
          fs.remove(temp_filename);
        }
        // return_request([], 500);
    }

});
