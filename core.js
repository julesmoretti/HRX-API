
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
                                              password: process.env.MYSQL_PASSWORD,
                                              database: 'HRX',
                                              multipleStatements: true
                                            });


  var message                             = new apn.Notification();
      message.expiry                      = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
      message.badge                       = 3;
      message.sound                       = "ping.aiff";
      message.alert                       = "You have a new message";
      message.payload                     = {'state': 'home.map.menu.alumni'}; // custom key's that can be read on the app

  var options = { production: false,
                  "cert": "_certs/apnagent-dev-cert.pem",
                  "key": "_certs/apnagent-dev-key.pem"
   };

  var service = new apn.Connection( options );
      // console.log( service );
      service.on('connected', function() {
            console.log("Connected");
        });

      service.on('timeout', function () {
          console.log("Connection Timeout");
      });

      service.on('disconnected', function() {
          console.log("Disconnected from APNS");
      });

      service.on("transmitted", function(notification, device) {
          console.log("Notification transmitted to:" + device.token.toString("hex"));
      });

      service.on("transmissionError", function(errCode, notification, device) {
          console.error("Notification caused error: " + errCode + " for device ", device, 'AND notification', notification);
          if (errCode === 8) {
              console.log("A error code of 8 indicates that the device token is invalid. This could be for a number of reasons - are you using the correct environment? i.e. Production vs. Sandbox");
          }
      });

  var sampleToken = '<'+ process.env.TEMP_APN_TOKEN +'>';
  // var myDevice = new apn.Device( sampleToken );

      // service.pushNotification(message, myDevice);


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

      // setup e-mail data with unicode symbols
      var mailOptions = {
          from: 'HRX - Info <'+process.env.HRX_API_NOTI_EMAIL+'>', // sender address
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
    };

// sendMail( 'julesmoretti@me.com', 'From HRX', 'Hi Jules' );

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
  exports.apn_token                       = function ( req, res ) {
      console.log( "===============================" );
      console.log( '++++++++++ apn token ++++++++++' );
      console.log( "===============================" );

      // check to see if credentials were passed into the headers
      if ( req.headers[ 'x-hrx-user-token' ] && req.headers[ 'x-hrx-user-apn-token' ] ) {

        var token = req.headers[ 'x-hrx-user-token' ];
        var apn_token = req.headers[ 'x-hrx-user-apn-token' ];

        connection.query('SELECT id FROM access_right WHERE token = "'+token+'"', function( err, rows, fields ) {
          if (err) throw err;

          var hrx_id = rows[0].id;

          if ( rows && rows.length ) {
            connection.query('SELECT apn_token FROM devices WHERE id = '+hrx_id, function( err, rows, fields ) {
              if (err) throw err;
              if (rows && rows.length ) {
                res.send( { responseCode: 300, message: 'Already have it on file' } );
              } else {
                connection.query('INSERT INTO devices SET hrx_id = '+hrx_id+', apn_token = "'+ apn_token +'"', function( err, rows, fields ) {
                  if (err) throw err;
                  res.send( { responseCode: 200, message: 'Added device to Database' } );
                });
              }
            });
          } else {
            res.send( { responseCode: 401, message: 'APN token - No valid token found... please report this error' } );
          }
        });

      // no headers detected so nothing to respond
      } else {
        res.send( { responseCode: 400, message: 'APN token - No header detected... please report this error' } );
      }
    };


//  -----------------------------------------------------------------------------
//  /tokencheck = checks to see if token is still identical and that user exist
//  -----------------------------------------------------------------------------
    // FROM |
    //      -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
    //  TO  |
//  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  exports.tokencheck                      = function ( req, res ) {
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
  exports.resetPasswordInitializer        = function ( req, res ) {
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
  exports.resetpassword                   = function ( req, res ) {
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
  exports.signup                          = function ( req, res ) {

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
  exports.hello                           = function ( req, res ) {
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


  // CHECK TO SEE IF USER HAS ALREADY BEEN ADDED TO THE DATABSE
  var checkUsersExistance                 = function ( GH_id, callback ) {
    connection.query('SELECT * FROM access_right WHERE GH_id = '+GH_id, function( err, rows, fields ) {
      if (err) throw err;
      if ( rows && rows.length ) {
        callback( true );
      } else {
        callback( false );
      }
    });
  }

  // PULL GIT HUB DATA
  var userData                            = function ( token, callback ) {
      console.log('++++++++ userData ++++++++');

      var options = {
          uri: 'https://api.github.com/user',
          // uri: 'https://api.github.com/user/orgs',
          method: 'GET',
          headers:  { Accept: 'application/json',
                      'User-Agent' : process.env.GH_CLIENT_NAME,
                      'Authorization' : 'token '+ token }
      }

      request( options, function (error, response, body) {
        // console.log( "BODY OF githubdata", body);
        // RESPONSE
        // 'https://api.github.com/user'
          // { "login":"julesmoretti",
          //   "id":744300,
          //   "avatar_url":"https://avatars.githubusercontent.com/u/744300?v=3",
          //   "gravatar_id":"",
          //   "url":"https://api.github.com/users/julesmoretti",
          //   "html_url":"https://github.com/julesmoretti",
          //   "followers_url":"https://api.github.com/users/julesmoretti/followers",
          //   "following_url":"https://api.github.com/users/julesmoretti/following{/other_user}",
          //   "gists_url":"https://api.github.com/users/julesmoretti/gists{/gist_id}",
          //   "starred_url":"https://api.github.com/users/julesmoretti/starred{/owner}{/repo}",
          //   "subscriptions_url":"https://api.github.com/users/julesmoretti/subscriptions",
          //   "organizations_url":"https://api.github.com/users/julesmoretti/orgs",
          //   "repos_url":"https://api.github.com/users/julesmoretti/repos",
          //   "events_url":"https://api.github.com/users/julesmoretti/events{/privacy}",
          //   "received_events_url":"https://api.github.com/users/julesmoretti/received_events",
          //   "type":"User",
          //   "site_admin":false,
          //   "name":"Jules Moretti",
          //   "company":"",
          //   "blog":"behance.net/julesmoretti",
          //   "location":"San Francisco",
          //   "email":"julesmoretti@me.com",
          //   "hireable":false,
          //   "bio":null,
          //   "public_repos":26,
          //   "public_gists":0,
          //   "followers":4,
          //   "following":0,
          //   "created_at":"2011-04-21T17:33:29Z",
          //   "updated_at":"2015-06-22T21:27:28Z",
          //   "private_gists":0,
          //   "total_private_repos":19,
          //   "owned_private_repos":9,
          //   "disk_usage":148443,
          //   "collaborators":1,
          //   "plan":{"name":"small","space":976562499,"collaborators":0,"private_repos":10}
          // }

        callback( JSON.parse( body ) );
      });
    };

  // VERIFY IF USER IS PART OF THE HACK REACTOR ORGANIZATION
  var check_GH_organization               = function ( token, callback ) {
      console.log('++++++++ check_GH_organization ++++++++');

      var options = {
          // uri: 'https://api.github.com/user',
          uri: 'https://api.github.com/user/orgs',
          method: 'GET',
          headers:  { Accept: 'application/json',
                      'User-Agent' : process.env.GH_CLIENT_NAME,
                      'Authorization' : 'token '+token }
      }

      request( options, function (error, response, body) {
        // console.log( "BODY OF githubdata", body);
        // 'https://api.github.com/user/orgs'
          // [{
          //    "login":"hackreactor",
          //    "id":2824164,
          //    "url":"https://api.github.com/orgs/hackreactor",
          //    "repos_url":"https://api.github.com/orgs/hackreactor/repos",
          //    "events_url":"https://api.github.com/orgs/hackreactor/events",
          //    "members_url":"https://api.github.com/orgs/hackreactor/members{/member}",
          //    "public_members_url":"https://api.github.com/orgs/hackreactor/public_members{/member}",
          //    "avatar_url":"https://avatars.githubusercontent.com/u/2824164?v=3",
          //    "description":""
          //  },
          //  {
          //    "login":"PickleApp",
          //    "id":7663812,
          //    "url":"https://api.github.com/orgs/PickleApp",
          //    "repos_url":"https://api.github.com/orgs/PickleApp/repos",
          //    "events_url":"https://api.github.com/orgs/PickleApp/events",
          //    "members_url":"https://api.github.com/orgs/PickleApp/members{/member}",
          //    "public_members_url":"https://api.github.com/orgs/PickleApp/public_members{/member}",
          //    "avatar_url":"https://avatars.githubusercontent.com/u/7663812?v=3",
          //    "description":""
          //  }]

        // res.redirect('/hello');
        var body = JSON.parse( body );
        for ( var i = 0; i < body.length; i++ ) {
          if ( body[ i ].login === 'hackreactor' ) {
            callback( true );
            return;
          }
        }
        callback( false );
      });
    };

  // PULL GIT HUB DATA
  var LI_user_data                        = function ( token, callback ) {
      console.log('++++++++ LI_user_data ++++++++');

      var options = {
          uri: 'https://api.linkedin.com/v1/people/~:(id,location,positions,phone-numbers,main-address,num-connections,summary,public-profile-url,picture-urls::(original))',
          // uri: 'https://api.github.com/user/orgs',
          method: 'GET',
          headers:  { 'Content-Type': 'application/json',
                      'x-li-format': 'json',
                      'Authorization': 'Bearer '+token,
                      'Connection': 'Keep-Alive'
                      // 'User-Agent' : process.env.LI_CLIENT_NAME
                      }
      }

      request( options, function (error, response, body) {
        // console.log( 'HEADERS OF REQUEST', response.headers );
        // console.log( "BODY OF githubdata", body);
        // RESPONSE
          // {
          //   "id": "mzYEHm7Jbe",
          //   "location": {
          //     "country": {"code": "us"},
          //     "name": "San Francisco Bay Area"
          //   },
          //   "numConnections": 500,
          //   "pictureUrls": {
          //     "_total": 1,
          //     "values": ["https://media.licdn.com/mpr/mprx/0_0Mv5eX6dIr4ESbM8yeWCOyIoelNF7wc8eeWFyVcdUuMbObNhexWC7fBuo8Mb7IJ_JeeiHf9dMvvbpsv5R-Xox0nfavvFps5_D-XboXE7U7XapDqoDnqQ2-qIUg"]
          //   },
          //   "positions": {
          //     "_total": 1,
          //     "values": [{
          //       "company": {
          //         "id": 21717,
          //         "industry": "Design",
          //         "name": "WET Design",
          //         "size": "201-500 employees",
          //         "type": "Privately Held"
          //       },
          //       "id": 665155010,
          //       "isCurrent": true,
          //       "startDate": {"year": 2015},
          //       "title": "Design Technologist"
          //     }]
          //   },
          //   "publicProfileUrl": "https://www.linkedin.com/in/julesmoretti",
          //   "summary": "I am a trained international industrial designer with four years experience building and managing multi-million dollar water features located all around the world.\n\nI have evolved from mechanical engineering, through design to software engineering. French born and having lived from Scotland, to Los Angeles and now San Francisco, I believe I can bring an original point of view to most problems and hopefully an unexpected solution.\n\nI love challenges and look forward to being put to the test.\n\nSPECIALITIES\nCreative & Strategic Bridge · Team Building & Leadership · Project Management · Budgeting · Research & Development · Process Optimization & Cost control · Project & Strategic Planning · User Experience & Multimedia Design · Art Direction · Web Development · Graphic Design"
          // }


        // callback( body );
        callback( JSON.parse( body ) );
      });
    };

  var LI_company_data                     = function ( token, company_id, callback ) {
      console.log('++++++++ LI_company_data ++++++++');

      var options = {
          // uri: 'https://api.linkedin.com/v1/companies/21717?format=json',
          uri: 'https://api.linkedin.com/v1/companies/'+company_id+'?format=json',
          method: 'GET',
          headers:  { 'Content-Type': 'application/json',
                      'x-li-format': 'json',
                      'Authorization': 'Bearer '+token
                      }
      }

      request( options, function (error, response, body) {
        // console.log( "BODY OF githubdata", body);
        // RESPONSE
          // {
          //   "id": "mzYEHm7Jbe",
          //   "location": {
          //     "country": {"code": "us"},
          //     "name": "San Francisco Bay Area"
          //   },
          //   "numConnections": 500,
          //   "pictureUrl": "https://media.licdn.com/mpr/mprx/0_tYf_g3KFZ5r1mlJYcszSnzG6Z6ThD3I-tsMDZNNF0-PTelIPYYzSP1MFsGPTDh4PcscGr1nbr5_3I551ZDoxvzRwv5_8I570YDo8YqaQYkn23PN_-yyaO8hBzrMKC54acmm7JoNEo6Q",
          //   "positions": {
          //     "_total": 1,
          //     "values": [{
          //       "company": {
          //         "id": 21717,
          //         "industry": "Design",
          //         "name": "WET Design",
          //         "size": "201-500 employees",
          //         "type": "Privately Held"
          //       },
          //       "id": 665155010,
          //       "isCurrent": true,
          //       "startDate": {"year": 2015},
          //       "title": "Design Technologist"
          //     }]
          //   }
          // }

        // callback( body );
        callback( JSON.parse( body ) );
      });
  }

  var add_LI_company                      = function ( token, companyData, callback ) {
    console.log('++++++ add_LI_company +++++');

    // companyData = {
      //                 "id": 21717,
      //                 "industry": "Design",
      //                 "name": "WET Design",
      //                 "size": "201-500 employees",
      //                 "type": "Privately Held"
      //               }

    connection.query('SELECT id FROM companies WHERE company_id = '+companyData.id, function( err, rows, fields ) {
      if (err) throw err;

      // already exist returns HRX company id
      if ( rows && rows.length ) {
        connection.query('UPDATE access_right SET LI_company = '+rows[0].id+' WHERE token = "'+token+'"', function( err, rows, fields ) {
          if (err) throw err;
          callback();
        });
      } else {

        connection.query('INSERT INTO companies SET company_id = '+companyData.id+', name = "'+companyData.name+'", industry = "'+companyData.industry+'", size = "'+companyData.size+'", type = "'+companyData.type+'"', function( err, rows, fields ) {
          if (err) throw err;
          if ( rows && rows.insertId ) {
            connection.query('UPDATE access_right SET LI_company = '+rows.insertId+' WHERE token = "'+token+'"; INSERT INTO addition SET category = "companies", category_id = '+rows.insertId, function( err, results, fields ) {
              if (err) throw err;
              callback();
            });
          } else {
            throw err;
          }
        });
      }
    });
  }


//  -----------------------------------------------------------------------------
//  /login = serve the login page
//  -----------------------------------------------------------------------------
    // FROM |
    //      -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
    //  TO  |
//  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  exports.GH_login                        = function ( req, res ) {
      console.log('++++++++ GH_login ++++++++');
      // console.log("authorizing", process.env.GH_REDIRECT_URL);
      var url = 'https://github.com/login/oauth/authorize/?client_id='+process.env.GH_CLIENT_ID+'&redirect_uri='+process.env.GH_REDIRECT_URL+'&scope=user,read:repo_hook,read:org&state='+process.env.GH_STATE;
      res.redirect(url);
    };

  exports.GH_oauth                        = function ( req, res ) {
      console.log('++++++++ GH_oauth ++++++++');
      // console.log( "HEADER: ", req.headers );
      // console.log( "QUERY: ", req.query );
      // console.log( "BODY: ", req.body );

      var data = { 'client_id' : process.env.GH_CLIENT_ID,
                   'client_secret' : process.env.GH_CLIENT_SECRET,
                   'redirect_uri' : process.env.GH_REDIRECT_URL,
                   'code' : req.query.code
                  };

      var options = {
          uri: 'https://github.com/login/oauth/access_token',
          method: 'POST',
          headers: { Accept: 'application/json' },
          form: data
      }

      request( options, function (error, response, body) {
        // body = {"access_token":"b414b344jhk42636349833827832","token_type":"bearer","scope":"user"}
        var GH_access_token = JSON.parse( body ).access_token;

        // checks to see if Git Hub user is part of "Hack Reactor" response Boolean
        check_GH_organization( GH_access_token, function( member ){

          // if true
          if ( member ) {

            // gets user data from Git Hub
            userData( GH_access_token, function( result ) {

              var GH_id = result.id;

              // create a unique HRX token
              var token = crypto.randomBytes(16).toString('base64'); // create a token

              // 'https://api.github.com/user'
                // { "login":"julesmoretti",
                //   "id":744300,
                //   "avatar_url":"https://avatars.githubusercontent.com/u/744300?v=3",
                //   "gravatar_id":"",
                //   "url":"https://api.github.com/users/julesmoretti",
                //   "html_url":"https://github.com/julesmoretti",
                //   "followers_url":"https://api.github.com/users/julesmoretti/followers",
                //   "following_url":"https://api.github.com/users/julesmoretti/following{/other_user}",
                //   "gists_url":"https://api.github.com/users/julesmoretti/gists{/gist_id}",
                //   "starred_url":"https://api.github.com/users/julesmoretti/starred{/owner}{/repo}",
                //   "subscriptions_url":"https://api.github.com/users/julesmoretti/subscriptions",
                //   "organizations_url":"https://api.github.com/users/julesmoretti/orgs",
                //   "repos_url":"https://api.github.com/users/julesmoretti/repos",
                //   "events_url":"https://api.github.com/users/julesmoretti/events{/privacy}",
                //   "received_events_url":"https://api.github.com/users/julesmoretti/received_events",
                //   "type":"User",
                //   "site_admin":false,
                //   "name":"Jules Moretti",
                //   "company":"",
                //   "blog":"behance.net/julesmoretti",
                //   "location":"San Francisco",
                //   "email":"julesmoretti@me.com",
                //   "hireable":false,
                //   "bio":null,
                //   "public_repos":26,
                //   "public_gists":0,
                //   "followers":4,
                //   "following":0,
                //   "created_at":"2011-04-21T17:33:29Z",
                //   "updated_at":"2015-06-22T21:27:28Z",
                //   "private_gists":0,
                //   "total_private_repos":19,
                //   "owned_private_repos":9,
                //   "disk_usage":148443,
                //   "collaborators":1,
                //   "plan":{"name":"small","space":976562499,"collaborators":0,"private_repos":10}
                // }

              // look into database see if this user exist response is boolean
              checkUsersExistance( GH_id, function( inDatabase ) {

                if ( !inDatabase ) {

                  connection.query( 'INSERT INTO access_right SET full_name = "'+result.name+'", username = "'+result.login+'", email = "'+result.email+'", blog = "'+result.blog+'", GH_location = "'+result.location+'", token = "'+token+'", GH_id = "'+GH_id+'", GH_url = "'+result.html_url+'", GH_profile_picture = "'+result.avatar_url+'", GH_public_repos = '+result.public_repos+', GH_private_repos = '+result.total_private_repos+', GH_access_token = "'+GH_access_token+'", creation_date = now()', function( err, rows, fields ) {
                  // connection.query'INSERT INTO access_right SET full_name = '+result.avatar_url, function( err, rows, fields ) {
                    if (err) throw err;

                    connection.query( 'SELECT id, token from access_right WHERE GH_id = '+GH_id, function( err, rows, fields ) {
                      if (err) throw err;

                      // unique url used for the inApp Browser to pick when everything is finished
                      var url = 'http://localhost:1234/gh_success/';

                      var params = { user_id: rows[0].id, access_token : token, message: 'Welcome to HRX!' };

                      res.redirect( url + "?" + encodeURIComponent( JSON.stringify( params ) ) );
                    });
                  });
                } else {
                  connection.query( 'SELECT id, token from access_right WHERE GH_id = '+result.id, function( err, rows, fields ) {
                    if (err) throw err;

                    if ( rows && rows.length ) {

                      var url = 'http://localhost:1234/gh_success/';
                      var params = { user_id: rows[0].id, access_token : rows[0].token, message: 'Welcome back!' };
                      res.redirect( url + "?" + encodeURIComponent( JSON.stringify( params ) ) );
                    }
                  });
                }
              });

            });


          } else {

            var url = 'http://localhost:1234/gh_failure';
            var params = { message : 'Sorry you do not seem to be a member'};
            res.redirect( url + "?" + encodeURIComponent( JSON.stringify( params ) ) );
          }
        });
      });
    };

  exports.LI_login                        = function ( req, res ) {

      console.log('++++++++ LI_login ++++++++');
      // console.log(process.env.LI_CLIENT_ID, process.env.LI_REDIRECT_URI, process.env.LI_STATE );
      var url = 'https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id='+ process.env.LI_CLIENT_ID +'&redirect_uri='+ process.env.LI_REDIRECT_URI +'&state='+process.env.LI_STATE+'&scope=r_basicprofile+r_emailaddress';
      // var url = 'https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id='+ process.env.LI_CLIENT_ID +'&redirect_uri='+ process.env.LI_REDIRECT_URI +'&state='+process.env.LI_STATE+'&scope=r_basicprofile+r_emailaddress+rw_company_admin';
      res.redirect(url);
    };

  exports.LI_oauth                        = function ( req, res ) {
      console.log('++++++++ LI_oauth ++++++++');
      // console.log( "HEADER: ", req.headers );
      // console.log( "QUERY: ", req.query );
      // console.log( "BODY: ", req.body );

      // res.send( req.query );

      var data = { 'grant_type' : 'authorization_code',
                   'code' : req.query.code,
                   'redirect_uri' : process.env.LI_REDIRECT_URI,
                   'client_id' : process.env.LI_CLIENT_ID,
                   'client_secret' : process.env.LI_CLIENT_SECRET
                  };

      var options = {
          uri: 'https://www.linkedin.com/uas/oauth2/accessToken',
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          form: data
      }

      request( options, function (error, response, body) {
        if (error) {
          console.log( error );
          res.send( error );
        } else {

          // console.log( "BODY OF LI_OAUTH", body);

          var LI_token = JSON.parse( body ).access_token

          // console.log( "TOKEN", LI_token );

          var url = 'http://localhost:1234/li_success/';
          var params = { LI_token : LI_token, message: 'Welcome to HRX!' };

          res.redirect( url + "?" + encodeURIComponent( JSON.stringify( params ) ) );
        }
      });
    };

  exports.LI_token                        = function ( req, res ) {
      console.log('++++++++ LI_token ++++++++');
      // console.log( "HEADER: ", req.headers );
      // console.log( "QUERY: ", req.query );
      // console.log( "BODY: ", req.body );

      // res.send( req.query );

      // return;
      if ( req.headers[ 'x-hrx-user-token' ] && req.headers[ 'x-hrx-li-token' ] ) {

        var userToken = req.headers[ 'x-hrx-user-token' ];
        var userLIToken = req.headers[ 'x-hrx-li-token' ];
        // check to see if both username and password crentials were part of the headers objects
        // if ( userData.username && userData.token ) {

          // check that username exist in the database and that password is a match otherwise return error
          connection.query('SELECT id, user_status FROM access_right WHERE token = "'+userToken+'"', function( err, rows, fields ) {
            if (err) throw err;

            if ( rows && rows.length ) {

              var user_id = rows[0].id;
              var user_status = rows[0].user_status;

              // get LI user Data
              LI_user_data( userLIToken, function( LI_data ) {

                // console.log( typeof LI_data, JSON.stringify( LI_data ) );
                // RESPONSE
                  // {
                  //   "id": "mzYEHm7Jbe",
                  //   "location": {
                  //     "country": {"code": "us"},
                  //     "name": "San Francisco Bay Area"
                  //   },
                  //   "numConnections": 500,
                  //   "pictureUrls": {
                  //     "_total": 1,
                  //     "values": ["https://media.licdn.com/mpr/mprx/0_0Mv5eX6dIr4ESbM8yeWCOyIoelNF7wc8eeWFyVcdUuMbObNhexWC7fBuo8Mb7IJ_JeeiHf9dMvvbpsv5R-Xox0nfavvFps5_D-XboXE7U7XapDqoDnqQ2-qIUg"]
                  //   },
                  //   "positions": {
                  //     "_total": 1,
                  //     "values": [{
                  //       "company": {
                  //         "id": 21717,
                  //         "industry": "Design",
                  //         "name": "WET Design",
                  //         "size": "201-500 employees",
                  //         "type": "Privately Held"
                  //       },
                  //       "id": 665155010,
                  //       "isCurrent": true,
                  //       "startDate": {"year": 2015},
                  //       "title": "Design Technologist"
                  //     }]
                  //   },
                  //   "publicProfileUrl": "https://www.linkedin.com/in/julesmoretti",
                  //   "summary": "I am a trained international industrial designer with four years experience building and managing multi-million dollar water features located all around the world.\n\nI have evolved from mechanical engineering, through design to software engineering. French born and having lived from Scotland, to Los Angeles and now San Francisco, I believe I can bring an original point of view to most problems and hopefully an unexpected solution.\n\nI love challenges and look forward to being put to the test.\n\nSPECIALITIES\nCreative & Strategic Bridge · Team Building & Leadership · Project Management · Budgeting · Research & Development · Process Optimization & Cost control · Project & Strategic Planning · User Experience & Multimedia Design · Art Direction · Web Development · Graphic Design"
                  // }

                  // LI_company

                  // LI_access_token

                connection.query('UPDATE access_right SET LI_url = "'+LI_data.publicProfileUrl+'", LI_description = "'+LI_data.summary+'", LI_id = "'+LI_data.id+'", LI_location_country_code = "'+LI_data.location.country.code+'", LI_location_name = "'+LI_data.location.name+'", LI_positions = "'+LI_data.positions.values[0].title+'", LI_profile_picture = "'+LI_data.pictureUrls.values[0]+'", LI_access_token = "'+userLIToken +'" WHERE token = "'+userToken+'"', function( err, rows, fields ) {
                  if (err) throw err;

                  connection.query('INSERT INTO addition SET category = "new_user", category_id = '+user_id, function( err, rows, fields ) {
                    if (err) throw err;

                    add_LI_company( userToken, LI_data.positions.values[0].company, function(){
                      res.send( { responseCode: 200, message: 'Thank you all clear here!', user_id: user_id, user_status: user_status } );
                    });

                  });
                });

              });
            } else {
              res.send( { responseCode: 401, message: 'no username found' } );
            }
          });

        // } else {
          // res.send( { responseCode: 401, message: 'no username or token inputed' } );
        // }

      // no headers detected so nothing to respond
      } else {
        res.send( { responseCode: 400, message: 'no header detected' } );
      }
    };

  exports.geo_position                    = function ( req, res ) {
      console.log('++++++++ geo_position ++++++++');
      // console.log( "HEADER: ", req.headers );
      console.log( "QUERY: ", req.query );
      // console.log( "BODY: ", req.body );

      if ( req.headers[ 'x-hrx-user-token' ] ) {
        var userToken = req.headers[ 'x-hrx-user-token' ];
        var latitude = req.query.latitude;
        var longitude = req.query.longitude;
        var addition = req.query.addition

        connection.query('UPDATE access_right SET latitude = '+latitude+', longitude = '+longitude+', geoposition_timestamp = now() WHERE token = "'+userToken+'"', function( err, rows, fields ) {
          if (err) throw err;

          if ( addition === undefined ) {
            var addition = 0;
          }

          connection.query('SELECT id, category, category_id FROM addition WHERE id > '+addition+' ORDER BY id ASC', function( err, rows, fields ) {
            if (err) throw err;

            if ( rows && rows.length) {

              console.log( 'addition', addition );
              console.log( 'rows', rows );


              var new_user_ids = {};
              var new_user = '';

              var companies_ids = {};
              var companies = '';

              var geoLocations_ids = {};
              var geoLocations = '';

              for ( var i = 0; i < rows.length; i++ ) {

                var last_id = rows[i].id;

                if ( rows[i].category === "new_user" ) {

                  new_user_ids[ rows[i].category_id ] = true;

                } else if ( rows[i].category === "companies" ) {

                  companies_ids[ rows[i].category_id ] = true;

                } else if ( rows[i].category === "geoLocations" ) {

                  geoLocations_ids[ rows[i].category_id ] = true;

                }
              }

              console.log('new_user_ids', new_user_ids);
              console.log('companies_ids', companies_ids);
              console.log('geoLocations_ids', geoLocations_ids);

              for ( var new_user_id in new_user_ids ) {

                if ( new_user.length ) {
                  new_user = new_user + ',' + new_user_id;
                } else {
                  new_user = new_user + new_user_id;
                }

              }

              console.log('new_user', new_user);

              for ( var companies_id in companies_ids ) {

                if ( companies.length ) {
                  companies = companies + ',' + companies_id;
                } else {
                  companies = companies + companies_id;
                }

              }

              console.log('companies', companies);

              for ( var geoLocations_id in geoLocations_ids ) {

                if ( geoLocations.length ) {
                  geoLocations = geoLocations + ',' + geoLocations_id;
                } else {
                  geoLocations = geoLocations + geoLocations_id;
                }

              }

              console.log('geoLocations', geoLocations);

              // TODO - REDUCE return count

              connection.query('SELECT id, full_name, email, blog, skills, user_status, GH_url, GH_location, GH_public_repos, GH_private_repos, GH_profile_picture, LI_location_country_code, LI_location_name, LI_positions, LI_description, LI_degrees, LI_address, LI_phone_number, LI_url, LI_company, LI_profile_picture FROM access_right WHERE id IN ("'+new_user+'"); SELECT * FROM companies WHERE id IN ("'+companies+'"); SELECT id, latitude, longitude FROM access_right WHERE id IN ("'+geoLocations+'")', function( err, results, fields ) {
                if (err) throw err;

                if ( results && results.length ) {

                  var data = { responseCode: 200, message: 'Updated Geo Position', last_id: last_id };

                  if ( results.length ) {
                    // there is new_users
                    if ( results[0].length ) {
                      data.new_users = results[0][0];
                    }

                    // there are new companies
                    if ( results[1].length ) {
                      data.companies = results[1][0];
                    }

                    // there are new geolocatoins
                    if ( results[2].length ) {
                      data.geolocatoins = results[2][0];
                    }
                  }

                  res.send( data );
                } else {
                  res.send( { responseCode: 200, message: 'Updated Geo Position', last_id: last_id } );
                }

              });

            } else {
              res.send( { responseCode: 200, message: 'Updated Geo Position', last_id: addition } );
            }

          });

        });

      // no headers detected so nothing to respond
      } else {
        res.send( { responseCode: 400, message: 'no header detected' } );
      }
    };

  exports.geo_positioning_setting         = function ( req, res ) {
      console.log('++++++++ geo_positioning_setting ++++++++');
      // console.log( "HEADER: ", req.headers );
      // console.log( "QUERY: ", req.query );
      // console.log( "BODY: ", req.body );

      if ( req.headers[ 'x-hrx-user-token' ] ) {
        var userToken = req.headers[ 'x-hrx-user-token' ];
        var state = req.query.value;

        // console.log( typeof state, state, userToken, apn_token );

        connection.query('SELECT id from access_right WHERE token = "'+userToken+'"', function( err, rows, fields ) {
          if (err) throw err;
          if ( rows && rows.length ) {

            if ( state === 'true' ) {
              connection.query('UPDATE access_right SET share_geoposition = 1 WHERE token = "'+userToken+'"', function( err, rows, fields ) {
                if (err) throw err;
                res.send( { responseCode: 200, message: 'Updated geo position settings to ON', value: true } );
              });

            } else {
              connection.query('UPDATE access_right SET share_geoposition = 0 WHERE token = "'+userToken+'"', function( err, rows, fields ) {
                if (err) throw err;
                res.send( { responseCode: 200, message: 'Updated geo position settings to OFF', value: false } );
              });
            }

          } else {
            res.send( { responseCode: 401, message: 'geo_positioning_setting - No valid token found... please report this error' } );
          }

        });
        // var  = req.query.latitude;
        // var longitude = req.query.longitude;
        // console.log('THERE IS AN ACCESS TOKEN', latitude, longitude, userToken );



      // no headers detected so nothing to respond
      } else {
        res.send( { responseCode: 400, message: 'no header detected' } );
      }
    };

  exports.notifications_setting           = function ( req, res ) {
      console.log('++++++++ notifications_setting ++++++++');
      // console.log( "HEADER: ", req.headers );
      // console.log( "QUERY: ", req.query );
      // console.log( "BODY: ", req.body );

      if ( req.headers[ 'x-hrx-user-token' ] && req.headers[ 'x-hrx-user-apn-token' ] ) {
        var userToken = req.headers[ 'x-hrx-user-token' ];
        var apn_token = req.headers[ 'x-hrx-user-apn-token' ];
        var state = req.query.value;

        // console.log( typeof state, state, userToken, apn_token );

        connection.query('SELECT id from access_right WHERE token = "'+userToken+'"', function( err, rows, fields ) {
          if (err) throw err;
          if ( rows && rows.length ) {

            if ( state === 'true' ) {
              connection.query('UPDATE devices SET state = 1 WHERE hrx_id = '+rows[0].id+' AND apn_token= "'+apn_token+'"', function( err, rows, fields ) {
                if (err) throw err;
                res.send( { responseCode: 200, message: 'Updated notifications to ON', value: true } );
              });

            } else {
              connection.query('UPDATE devices SET state = 0 WHERE hrx_id = '+rows[0].id+' AND apn_token= "'+apn_token+'"', function( err, rows, fields ) {
                if (err) throw err;
                res.send( { responseCode: 200, message: 'Updated notifications to OFF', value: false } );
              });
            }

          } else {
            res.send( { responseCode: 401, message: 'Notifications_Setting - No valid token found... please report this error' } );
          }

        });
        // var  = req.query.latitude;
        // var longitude = req.query.longitude;
        // console.log('THERE IS AN ACCESS TOKEN', latitude, longitude, userToken );



      // no headers detected so nothing to respond
      } else {
        res.send( { responseCode: 400, message: 'no header detected' } );
      }
    };
