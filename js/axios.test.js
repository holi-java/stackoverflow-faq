/**
 * Created by holi on 3/9/17.
 */
import axios from 'axios';
//This WORKS
test('testing with headers', (done) => {
    var path = require('path');
    var lib = path.join(path.dirname(require.resolve('axios')), 'lib/adapters/http');
    var http = require(lib);


    axios.get('http://192.168.1.253', {
        adapter: http,//or set the jest testURL with the same domain for ajax in package.json
        headers: {
            Authorization: "Basic YWRtaW46bHVveGlueGlhbjkx"
        }
    }).then((res) => {
        expect(res.status).toBe(200);
        done();
    }).catch(done.fail);
});


function getDefaultAdapter() {
    var adapter;
    if (typeof XMLHttpRequest !== 'undefined') {
        // For browsers use XHR adapter
        adapter = require('./adapters/xhr');
    } else if (typeof process !== 'undefined') {
        // For node use HTTP adapter
        adapter = require('./adapters/http');
    }
    return adapter;
}