'use strict';

var express = require('express');
var path = require('path');
var app = express();

var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


// Setup View Engines
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// Serve files from your "public" directory
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve files from your "bower_components" directory
app.use('/bower_components', express.static(path.join(__dirname, '/bower_components')));

// GET index.html route
app.get('/', function(req, res) {
  //res.send('Hello World!');
  return res.render('index');
});

// GET editor.html route
app.get('/editor', function(req, res) {
  //res.send('Hello World!');
  return res.render('editor');
});

// GET editor.html route
app.get('/shop.html', function(req, res) {
  //res.send('Hello World!');
  return res.render('shop.html');
});
// json
var fs = require('fs');





// Start our server and start to listen
app.listen(process.env.PORT || 3000, function() {
  console.log('listening');
});







// router 
// the function named something should be called something better like, postHighscore. it takes our highscores from an array and posts them to the server json file
function something(req, res) {

    // console.log the request body
    console.log("yes");
    console.log(req.body);
    // write to the json our value
    fs.writeFile(__dirname+"../public/app/restfuls.json", JSON.stringify(req.body), function(err) {
	   
	}); 
	
    // respond JSON object
    var _respond = {
        'status': 200
    };

    // expressjs respond a JSON with status code 200
    res.status(200).json(_respond);
}

// register route URL
app.post('/', something);


