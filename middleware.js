//  middleware.js

//  set up ======================================================================
var bodyParser                            = require('body-parser'),
    morgan                                = require('morgan');

module.exports                            = function(app){
//  loading standard middleware =================================================

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
      extended: true
    }));

//  logger for development ======================================================
    app.use(morgan('dev')); // log every request to the console

//  html rendering engine =======================================================
    app.set('views', './views');
    app.set('view engine', 'ejs');

};
