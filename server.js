var url = require('url'),
    http = require('http'),
    https = require('https');

http.createServer(function(req, res) {

    var data = url.parse(req.url);
    var params = {};
    params.protocol = data.protocol;
    params.hostname = data.hostname;
    params.port = data.port;
    params.method = req.method;
    params.path = data.path;
    params.headers = req.headers;

    var proxy_request;
    if (data.protocol === 'https:') {
        proxy_request = https.request(params);
    } else {
        proxy_request = http.request(params);
    }


    proxy_request.on('response', function (proxy_response) {
        proxy_response.pipe(res);
        res.writeHead(proxy_response.statusCode, proxy_response.headers);
    });

    proxy_request.on('error', function (err) {
        console.error(err);
    });

    req.pipe(proxy_request);

}).listen(process.env.PORT || 3000);
