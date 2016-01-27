var express = require('express');
var vhost = require('vhost');
var app = express();

app.use(express.static(__dirname+'/public_html'));

app.all('/*', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('public_html/index.html', { root: __dirname });
});

var port = 3000;

app.listen(port, function(){
	console.log('Server Listening on port ' + port);
});
