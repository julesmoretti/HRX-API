//  middleware.js

//  set up ======================================================================
var bodyParser                            = require('body-parser'),
    morgan                                = require('morgan');

  if( process.env.LOCAL ){
    sass                                  = require('node-sass');
  }

  module.exports                          = function(app){

//  sass css generator ==========================================================
    if( process.env.LOCAL ){

      sass.render({
        file: './views/sass/style.scss',
        success: function(css) {
          // console.log(css);
          console.log('style.css overwritten');
          console.log('============================================');
        },
        error: function(error) {
          console.log(error);
        },
        includePaths: ['views/css'],
        // outputStyle: 'compressed',
        outFile: './views/css/style.css'
      });
    }

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
