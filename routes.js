//  app/routes.js

//  =============================================================================
//  SET UP AND GLOBAL VARIABLES
//  =============================================================================

var core                                  = require('./core.js');

//  =============================================================================
//  ROUTES
//  =============================================================================

  module.exports = function(app) {

    // allows for cross browser communication
    app.all( '/*', function(req, res, next) {

      // console.log( "HEADER: ", req.headers );
      // Website you wish to allow to connect
      res.setHeader('Access-Control-Allow-Origin', '*');

      // Request methods you wish to allow
      // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

      // Request headers you wish to allow
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization, X-HRX-User-New-Credential, X-HRX-User-Credential, X-HRX-User-Token, X-HRX-User-Reset-Password-Initializer, X-HRX-User-Reset-Password' );

      // Set to true if you need the website to include cookies in the requests sent
      // to the API (e.g. in case you use sessions)
      // res.setHeader('Access-Control-Allow-Credentials', false);

      next();
    });

    // landing page to site loads default - login.ejs
    app.get('/', core.main);

    // check for token changes
    app.get('/tokencheck', core.tokencheck);

    // handles login request and provides a token in response
    app.get('/login', core.login);

    // send a link to reset
    app.get('/resetpasswordinitializer', core.resetPasswordInitializer);

    // displays the reset password langing page
    app.get('/resetpassword', core.resetpasswordpage);

    // send a link to reset
    app.post('/resetpassword', core.resetpassword);


    // handles signup request and provides a token in response
    app.get('/signup', core.signup);

    // landing page to site loads default - login.ejs
    app.get('/hello', core.hello);

    // send any unknown directory to the 404 page!
    app.get('*', function(req, res){
      res.redirect('./404/');
    });

  };
