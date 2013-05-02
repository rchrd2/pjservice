/**
 * PJS Service (!)
 *
 * @author Richard Caceres, me@rchrd.net
 *
 */

var server = require('webserver').create(),
    system = require('system'),
    fs = require('fs');
    

if(system.args.length !== 2) {
    console.log('Usage: postserver.js <portnumber>');
    phantom.exit(1);
}

var port = system.args[1];


service = server.listen(port, function (request, response) {
    console.log('Request received at ' + new Date());

    var result_data = null;

    return_request = function(result_data, statusCode) {
        response.headers = {
            'Cache': 'no-cache',
            'Content-Type': 'text/plain;charset=utf-8'
        };
        response.statusCode = statusCode;
        response.write(result_data);
        response.close();
    };


    try {
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
            log: 'none',
            timeoutInterval: 10,
            writer: 'file',
            outFile: temp_filename
        });

        pjs.addSuite({
            url: module.url,
            scraper: module.scraper
        });

        /* pjs.init() is asynchronous so we have to define a handler */
        phantom.pjs_init_complete = function() {
            result_data = fs.read(temp_filename);
            /* remove temporary filename */
            fs.remove(temp_filename);
            return_request(result_data, 200);
        };
        
        pjs.init();


    } catch (err) {
        console.log("ERROR: " + err);
        return_request({'error':true}, 304);
        /* remove temporary filename */
        fs.remove(temp_filename);
    }

});
