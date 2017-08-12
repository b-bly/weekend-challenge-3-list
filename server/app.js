//what was the attach thing in package.json that we did to get start etc?
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var list = require('./routes/list.js')

var port = 5000;


app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
//app.use('/list', list);


app.listen(port, function() {
	console.log('listening on port', port);
});
