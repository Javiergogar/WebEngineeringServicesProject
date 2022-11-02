// Import express module
var express = require('express');
// Import path module
var path = require('path');
// Import logger module
var logger = require('morgan');
//Import cookie parser
var cookieParser = require('cookie-parser');
//Import Model
var model = require('./model/model.js')

// Instantiate the express middleware
var app = express();

// Load logger module
app.use(logger('dev'));

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Set public folder to publish static content
app.use(express.static(path.join(__dirname , 'public')));
//Tiene que estar en este orden concreto
app.get('/api/products', function (req, res, next) {
  return res.json(model.products);
});
// Set redirection to index.html 
app.get(/\/.*/, function (req, res) { 
    res.sendFile(path.join(__dirname, '/public/index.html')); 
  });
// Listen to port 3000
app.listen(3000, function () {
console.log('GameShop Web app listening on port 3000!');
});