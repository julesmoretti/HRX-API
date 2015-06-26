
//  =============================================================================
//  SET UP AND GLOBAL VARIABLES
//  =============================================================================

var crypto                                = require('crypto'),
    request                               = require('request'),
    apn                                   = require('apn'),
    mysql                                 = require('mysql'),
    nodemailer                            = require('nodemailer'),
    connection                            = mysql.createConnection({
                                              host: 'localhost',
                                              port: 3306,
                                              user: 'root',
                                              password: process.env.MYSQLPASSWORD,
                                              database: 'HRX',
                                              multipleStatements: true
                                            });

  // var sampleToken = 3500d2dc866843fe3b6daa4a96354c9e88a5d14051;
  // var options = { };

  // var apnConnection = new apn.Connection(options);


//  =============================================================================
//  MAIN FUNTIONS
//  =============================================================================

//  -----------------------------------------------------------------------------
//  send email notification
//  -----------------------------------------------------------------------------
    // FROM |
    //      -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
    //  TO  |
//  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  var sendMail                            = function ( email, subject, body ) {
    console.log('++++++++ sendMail ++++++++');
      // var htmlBody = '<b>Hello world</b></br><div style="width:100px; height: 200px; background-color: red;">YOLLO</div>'
      // sendMail( 571377691, 'server was restarted', htmlBody );

      // create reusable transporter object using SMTP transport
      var transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
              user: process.env.HRX_API_NOTI_EMAIL,
              // user: 'dr.no@poweredbyq.io',
              pass: process.env.HRX_API_NOTI_PASSW
              // pass: 'M4tinc4lme.'
          }
      });


      var errorLimitDelay = 20; // minutes

      // connection.query('SELECT mNoti from settings', function(err, rows, fields) {
        // if (err) throw err;

        // if ( rows[0].mNoti ) {
          // connection.query('SELECT fancrawl_username, email, eNoti from access_right where fancrawl_instagram_id = "'+fancrawl_instagram_id+'"', function(err, rows, fields) {
            // if (err) throw err;
            // if ( rows && rows[0] && ( rows[0].eNoti !== 0 ) && ( rows[0].email !== null ) ) {

              // setup e-mail data with unicode symbols
              var mailOptions = {
                  from: 'Q - Info <'+process.env.HRX_API_NOTI_EMAIL+'>', // sender address
                  to: email , // list of receivers
                  subject: subject, // Subject line
                  text: body, // plaintext body
                  html: body // html body
                  // html: '<b>Hello world</b></br><div class="width:100px; height: 200px; background-color: red;">YOLLO</div>' // html body
              };

              // send mail with defined transport object
              transporter.sendMail( mailOptions, function( body, info ) {
                if ( body ) {
                  if ( body.responseCode === 454) {
                    // { [Error: Invalid login]
                      //    code: 'EAUTH',
                      //    response: '454 4.7.0 Too many login attempts, please try again later. ca2sm424696pbc.68 - gsmtp',
                      //    responseCode: 454 }
                    console.log( "eMail error 454 - Too many login attempts - waiting "+errorLimitDelay+" min and trying again.");
                    setTimeouts[ email ].sendEmail = setTimeout(
                      function(){
                          callTimer( arguments[0], arguments[1] );
                          console.log( "eMail error 454 - Too many login attempts - waited "+ arguments[3] +" min and attempted again.");
                          sendMail( arguments[0], arguments[1], arguments[2] );
                    }, 1000 * 60 * errorLimitDelay, email, subject, body, errorLimitDelay ); // 1 min wait

                  } else if ( body.responseCode === 421) {
                    // { [Error: Data command failed]
                      //    code: 'EENVELOPE',
                      //    response: '421 4.7.0 Temporary System Problem.  Try again later (WS). i4sm571837pdl.11 - gsmtp',
                      //    responseCode: 421 }
                    console.log( "eMail error 421 - Temporary System Problem - waiting "+errorLimitDelay+" min and trying again.");
                    setTimeouts[ email ].sendEmail = setTimeout(
                      function(){
                          callTimer( arguments[0], arguments[1] );
                          console.log( "eMail error 421 - Temporary System Problem - waited "+ arguments[3] +" min and attempted again.");
                          sendMail( arguments[0], arguments[1], arguments[2] );
                    }, 1000 * 60 * errorLimitDelay, email, subject, body, errorLimitDelay ); // 1 min wait

                  } else {
                    console.log( "email error -", body );
                    sendMail( 'adminID', 'mail error', 'The function sendMail got the following error: ' + body );
                  }

                } else {
                  console.log( 'Message sent: ' + info.response );
                };
              });
            // }
          // });
        // }
      // });
    };

// sendMail( 'julesmoretti@me.com', 'From Q', 'Hi Jules' );

//  -----------------------------------------------------------------------------
//  Test MYSQL
//  -----------------------------------------------------------------------------
    // FROM |
    //      -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
    //  TO  |
//  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  var testMysql                           = function ( ) {
    connection.query('SHOW TABLES', function( err, rows, fields ) {
      if (err) throw err;
      console.log('testMysql', rows)
    });
  };

  // testMysql();

//  =============================================================================
//  REQUEST HANDLERS
//  =============================================================================

//  -----------------------------------------------------------------------------
//  / = serve the mail landing page
//  -----------------------------------------------------------------------------
    // FROM |
    //      -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
    //  TO  |
//  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  exports.main                            = function ( req, res ) {
      console.log('++++++++ main ++++++++');
      var metrics = {};

      res.render('./partials/main.ejs',  metrics );
    };

//  -----------------------------------------------------------------------------
//  /resetpassword = displays the reset password page
//  -----------------------------------------------------------------------------
    // FROM |
    //      -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
    //  TO  |
//  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  exports.resetpasswordpage               = function ( req, res ) {
      console.log('++++++++ resetpasswordpage ++++++++');
      var metrics = {};

      res.render('./partials/resetpassword.ejs',  metrics );
    };

//  -----------------------------------------------------------------------------
//  /tokencheck = checks to see if token is still identical and that user exist
//  -----------------------------------------------------------------------------
    // FROM |
    //      -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
    //  TO  |
//  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  exports.tokencheck                           = function ( req, res ) {
      console.log( "===============================" );
      console.log( '+++++++++ tokencheck ++++++++++' );
      console.log( "===============================" );

      // check to see if credentials were passed into the headers
      if ( req.headers[ 'x-hrx-user-token' ] ) {

        var userData = JSON.parse( req.headers[ 'x-hrx-user-token' ] );

        // check to see if both username and password crentials were part of the headers objects
        if ( userData.username && userData.token ) {

          // check that username exist in the database and that password is a match otherwise return error
          connection.query('SELECT token FROM access_right WHERE username = "'+userData.username+'"', function( err, rows, fields ) {
            if (err) throw err;
            if ( rows.length && rows[0].token && rows[0].token === userData.token ) {
              res.send( { responseCode: 200, message: 'Still got it!' } );
            } else {
              res.send( { responseCode: 403, message: 'You lost it bro...' } );
            }
          });

        } else {
          res.send( { responseCode: 401, message: 'no username or token inputed' } );
        }

      // no headers detected so nothing to respond
      } else {
        res.send( { responseCode: 400, message: 'no header detected' } );
      }
    };

//  -----------------------------------------------------------------------------
//  /login = serve the login requests and return token or error response
//  -----------------------------------------------------------------------------
    // FROM |
    //      -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
    //  TO  |
//  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  exports.login                           = function ( req, res ) {
      console.log( "===============================" );
      console.log( '++++++++++++ login ++++++++++++' );
      console.log( "===============================" );

      // check to see if credentials were passed into the headers
      if ( req.headers[ 'x-hrx-user-credential' ] ) {

        var userData = JSON.parse( req.headers[ 'x-hrx-user-credential' ] );

        // check to see if both username and password crentials were part of the headers objects
        if ( userData.username && userData.password ) {

          // check that username exist in the database and that password is a match otherwise return error
          connection.query('SELECT id, salt, hashed, token FROM access_right WHERE username = "'+userData.username+'"', function( err, rows, fields ) {
            if (err) throw err;
            if ( rows.length && rows[0].id && rows[0].salt && rows[0].hashed ) {

              // crypto password and salt hasher to check if user is valid or not
              crypto.pbkdf2( userData.password, rows[0].salt, 4096, 64, 'sha256',  function(err, key) {
                if (err) throw err;
                if ( rows[0].hashed === key.toString('hex') ) {
                  // console.log('its a match');
                  // console.log( key.toString('hex') );
                  res.send( { responseCode: 200, message: 'Welcome back!', token: rows[0].token } );
                } else {
                  // console.log('its not a match');
                  // console.log( key.toString('hex') );
                  res.send( { responseCode: 402, message: 'Username does not exist or wrong password...' } );
                }
              });

            } else {
              res.send( { responseCode: 402, message: 'Username does not exist or wrong password...' } );
            }
          });

        } else {
          res.send( { responseCode: 401, message: 'no username or password inputed' } );
        }

      // no headers detected so nothing to respond
      } else {
        res.send( { responseCode: 400, message: 'no header detected' } );
      }
    };

//  -----------------------------------------------------------------------------
//  /resetpassword = receive a new password for a specific user to swap out
//  -----------------------------------------------------------------------------
    // FROM |
    //      -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
    //  TO  |
//  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  exports.resetPasswordInitializer                           = function ( req, res ) {
      console.log( "===============================" );
      console.log( '++ resetPasswordInitializer +++' );
      console.log( "===============================" );

      // check to see if credentials were passed into the headers
      if ( req.headers[ 'x-hrx-user-reset-password-initializer' ] ) {

        var userData = JSON.parse( req.headers[ 'x-hrx-user-reset-password-initializer' ] );

        // check to see if both username and password crentials were part of the headers objects
        if ( userData.username ) {

          // check that username exist in the database and that password is a match otherwise return error
          connection.query('SELECT id, email FROM access_right WHERE username = "'+userData.username+'"', function( err, rows, fields ) {
            if (err) throw err;

            if ( rows.length && rows[0].id && rows[0].email  ) {

              var passwordResetHash =  crypto.randomBytes(48).toString('base64');
              var email = rows[0].email;

              connection.query('UPDATE access_right SET reset_password_token = "'+passwordResetHash+'" WHERE username = "'+userData.username+'"', function( err, rows, fields ) {
                if (err) throw err;

                sendMail( email, 'HRX - Email Reset', 'Sorry to hear that you lost your password, but need not to worry click here to reset it: http://api.hrx.club/resetpassword?id='+ passwordResetHash )

                res.send( { responseCode: 200, message: 'Thank you '+userData.username+', check your email and spam!' } );

              });

            } else {
              res.send( { responseCode: 402, message: 'username does not exist' } );  // TODO DO NOT LEAVE THIS WHEN GOING LIVE DUE TO HACK BREACH
            }
          });

        } else {
          res.send( { responseCode: 401, message: 'no username inputed' } );
        }

      // no headers detected so nothing to respond
      } else {
        res.send( { responseCode: 400, message: 'no header detected' } );
      }
    };

//  -----------------------------------------------------------------------------
//  /resetpassword = receive a new password for a specific user to swap out
//  -----------------------------------------------------------------------------
    // FROM |
    //      -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
    //  TO  |
//  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  exports.resetpassword                           = function ( req, res ) {
      console.log( "===============================" );
      console.log( '++++++++ resetpassword ++++++++' );
      console.log( "===============================" );

      // check to see if there is both an id and a password
      if ( req.body.id && req.body.id.length === 64 && req.body.password && req.body.password.length ) {

        // look up salt and reset password id from database
        connection.query('SELECT salt FROM access_right WHERE reset_password_token = "'+req.body.id+'"', function( err, rows, fields ) {
          if (err) throw err;

          if ( rows.length && rows[0].salt ) {

            // crypto password and salt hasher to check if user is valid or not
            crypto.pbkdf2( req.body.password, rows[0].salt, 4096, 64, 'sha256',  function(err, key) {

              connection.query('UPDATE access_right SET hashed = "'+key.toString('hex')+'", reset_password_token = null WHERE reset_password_token = "'+req.body.id+'"', function( err, rows, fields ) {
                if (err) throw err;
                res.send( { responseCode: 200, message: 'Password updated :)'} );
              });
            });

          } else {
            res.send( { responseCode: 401, message: 'missing a valid id and a password...' } );
          }
        });

      // no headers detected so nothing to respond
      } else {
        res.send( { responseCode: 401, message: 'missing a valid id and a password' } );
      }
    };

//  -----------------------------------------------------------------------------
//  /signup = serve the signup request and respond with a token or error message
//  -----------------------------------------------------------------------------
    // FROM |
    //      -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
    //  TO  |
//  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  exports.signup                           = function ( req, res ) {

    console.log( "===============================" );
    console.log( '+++++++++++ signup ++++++++++++');
    console.log( "===============================" );

    var credentials = JSON.parse( req.headers[ 'x-hrx-user-new-credential' ] );

    if ( credentials ) {

      // look up salt and reset password id from database
      connection.query('SELECT id FROM access_right WHERE username = "'+credentials.username+'"; SELECT id FROM access_right WHERE email = "'+credentials.email+'"', function( err, rows, fields ) {
        if (err) throw err;

        if ( rows && rows.length && ( rows[0].length || rows[1].length ) ) {
          res.send( { responseCode: 402, message: 'username or email already taken... sorry :('} );
        } else {

          var birth = credentials.dob.split('-');

          var salt = crypto.randomBytes(12).toString('base64');

          var token = crypto.randomBytes(16).toString('base64');

          // crypto password and salt hasher to check if user is valid or not
          crypto.pbkdf2( credentials.password, salt, 4096, 64, 'sha256',  function(err, key) {
            connection.query('INSERT INTO access_right SET first = "'+credentials.first+'", last = "'+credentials.last+'", username = "'+credentials.username+'", email = "'+credentials.email+'", gender = "'+credentials.gender+'", birth_day = "'+birth[2]+'", birth_month = "'+birth[1]+'", birth_year = "'+birth[0]+'", salt = "'+salt+'", hashed = "'+key.toString('hex')+'", token = "'+token+'"', function( err, rows, fields ) {
              if (err) throw err;
              console.log('Added to database!');
              res.send( { responseCode: 200, message: 'Welcome to Q', token: token} );
            })
          });
        }
      });
    } else {
      res.send( { responseCode: 400, message: 'no header detected'} );
    }

    };

//  -----------------------------------------------------------------------------
//  /login = serve the login page
//  -----------------------------------------------------------------------------
    // FROM |
    //      -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
    //  TO  |
//  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  exports.hello                            = function ( req, res ) {
      console.log( "===============================" );
      console.log('++++++++ hello ++++++++');
      console.log( "===============================" );
      console.log( "HEADER: ", req.headers );
      // console.log( "HEADER: ", res );
      console.log( "QUERY: ", req.query );
      console.log( "BODY: ", req.body );

      var metrics = {jules: "says hello"};
      res.send( metrics );
    };
