// Example using HTTP POST operation

var server = require('webserver').create(),
    system = require('system'),
    fs = require('fs');
    

if (system.args.length !== 2) {
    console.log('Usage: postserver.js <portnumber>');
    phantom.exit(1);
}

var port = system.args[1];

/*
 * Require.js is better than the phantom js require. Since require is already 
 * defined. Requirejs gets called 'requirejs'
 */
//require = null;
phantom.injectJs('require.js');
phantom.injectJs('lib/md5.js');


service = server.listen(port, function (request, response) {
    console.log('Request received at ' + new Date());

    return_request = function(data) {
        response.headers = {
            'Cache': 'no-cache',
            'Content-Type': 'text/plain;charset=utf-8'
        };
        response.statusCode = 200;
        response.write(result_data);
        response.close();
    };

    /* insert code here */
    // parse post request
       // Validate Secret KEY for some security
       // use custom define function to get arguments from function
       // create temporary name for module
       // pass this to requirejs to load dependencies
       // use new module to run the code



    try {
        /* authenticate */
        if(request.post.token != 'lemons') {
            throw "Not authenticated";
        }

        if(typeof request.post.module != 'string') {
            throw "No post module";
        }

        /* We temporarily overwrite define to parse out information using a closure */
        module_obj = function(define) {
            return eval(request.post.module);
        }(function (name, deps, callback) {
            //console.log(name, deps, callback);
            
            //Allow for anonymous modules
            if (typeof name !== 'string') {
                //Adjust args appropriately
                callback = deps;
                deps = name;
                name = null;
            }

            //This module may not have dependencies
            if (! (toString.call(deps) === "[object Array]")) {
                callback = deps;
                deps = [];
            }

            return {
                "name" : "__post_module__" + String(Date.now() /1000 |0),
                "deps" : deps,
                "callback" : callback
            }
        })
        

        /* Now we finally execute our scraper */
        requirejs(['pjsmodule', module_obj.name], function(pjs, module) {
            result_data = run_module(module);
            return_request(result_data);
        });
        
        
        var result_data = run_module(module_obj);
        response.write(result_data);

        response.statusCode = 200;

    } catch (err) {
        console.log("ERROR: " + err);
        response.statusCode = 404;
    }
       
    

    //response.write(JSON.stringify(request, null, 4));

});


function run_module(module_obj) {
    var result_data = "{'hello':'world'}";
    
    /* now we define this module in the require scope */
    define(module_obj.name, module_obj.deps, module_obj.callback);
    
    
    /*
     * We initialize pjscraper using Require.js and AMD
     * The config for this scraper is loaded externally. The url is the argument
     * to the script.
     */
    pjs = require('pjsmodule');
    module = require(module_obj.name);
    
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

    try {

        /* create a temporary file to hold store scrape result */
        var temp_filename = fs.workingDirectory + '/tmp/out-' + system.pid + '.json';
        fs.touch(temp_filename);

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

        pjs.init();
        
        result_data = fs.read(temp_filename);
        
    } catch(err) {
        //phantom.exit(1);
        //throw err;
        var err = err;
    }
    
    /* remove temporary filename */
    fs.remove(temp_filename);

    
    /* the following line seems to effectively reset pjscrape after each run */
    requirejs.undef('pjsmodule');
    
    return result_data;
}
