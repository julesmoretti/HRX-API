
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
  exports.apn_token                           = function ( req, res ) {
      console.log( "===============================" );
      console.log( '++++++++++ apn token ++++++++++' );
      console.log( "===============================" );
      console.log(req.headers);

      // check to see if credentials were passed into the headers
      if ( req.headers[ 'x-hrx-user-token' ] && req.headers[ 'x-hrx-user-APN-token' ] ) {


        // // var userData = decodeURIComponent( req.headers[ 'x-hrx-user-token' ] );
        // var userData = req.headers[ 'x-hrx-user-token' ];

        // // check to see if both username and password crentials were part of the headers objects
        // if ( userData.username && userData.token ) {

        //   // check that username exist in the database and that password is a match otherwise return error
        //   connection.query('SELECT token FROM access_right WHERE username = "'+userData.username+'"', function( err, rows, fields ) {
        //     if (err) throw err;
        //     if ( rows.length && rows[0].token && rows[0].token === userData.token ) {
        //       res.send( { responseCode: 200, message: 'Still got it!' } );
        //     } else {
        //       res.send( { responseCode: 403, message: 'You lost it bro...' } );
        //     }
        //   });

        // } else {
        //   res.send( { responseCode: 401, message: 'no username or token inputed' } );
        // }

      // no headers detected so nothing to respond
      } else {
        res.send( { responseCode: 400, message: 'no header detected' } );
      }
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
        //{"access_token":"b414b344jhk42636349833827832","token_type":"bearer","scope":"user"}
        var GH_access_token = JSON.parse( body ).access_token;
        // console.log( "BODY OF OAUTH", GH_access_token, body );

        checkOrganization( GH_access_token, function( member ){
          if ( member ) {
            // console.log( 'XXXXXXXX checkOrganization success!', member );

            // save GitHub token
            // create new HRX token save that and send it back

            userData( GH_access_token, function( result ) {

              var token = crypto.randomBytes(16).toString('base64'); // create a token

              // console.log( result );

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

              checkUsersExistance( result.id, function( inDatabase ) {
                if ( !inDatabase ) {

                  connection.query( 'INSERT INTO access_right SET full_name = "'+result.name+'", username = "'+result.login+'", email = "'+result.email+'", blog = "'+result.blog+'", location = "'+result.location+'", token = "'+token+'", GH_id = "'+result.id+'", GH_url = "'+result.html_url+'", GH_access_token = "'+result.GH_access_token+'", profile_picture = "'+result.avatar_url+'"', function( err, rows, fields ) {
                  // connection.query'INSERT INTO access_right SET full_name = '+result.avatar_url, function( err, rows, fields ) {
                    if (err) throw err;

                    // var url = 'http://localhost:9000/#!/home/map';
                    var url = 'http://localhost:5000/success/';
                    var params = { access_token : token, message: 'Welcome to HRX!' };
                    res.redirect( url + "?" + encodeURIComponent( JSON.stringify( params ) ) );
                  });
                } else {
                  connection.query( 'SELECT token from access_right WHERE GH_id = '+result.id, function( err, rows, fields ) {
                    if (err) throw err;

                    if ( rows && rows.length ) {
                      // var url = 'http://localhost:9000/#!/home/map';
                      var url = 'http://localhost:5000/success/';
                      var params = { access_token : rows[0].token, message: 'Welcome back!' };
                      res.redirect( url + "?" + encodeURIComponent( JSON.stringify( params ) ) );
                    }
                  });
                }
              });

            });


          } else {
            console.log( 'XXXXXXXX checkOrganization FAILURE!', member );
            var url = 'http://localhost:5000/failure';
            var params = { message : 'Sorry you do not seem to be a member'};
            res.redirect( url + "?" + encodeURIComponent( JSON.stringify( params ) ) );

          }
        });
      });
    };

  // CHECK TO SEE IF USER HAS ALREADY BEEN ADDED TO THE DATABSE
  var checkUsersExistance          = function ( GH_id, callback ) {
    connection.query('SELECT * FROM access_right WHERE GH_id = '+GH_id, function( err, rows, fields ) {
      if (err) throw err;
      if ( rows && rows.length ) {
        callback( true );
      } else {
        callback( false );
      }
    });
  }

  // GIT HUB DATA
  var userData                     = function ( token, callback ) {
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

  var checkOrganization            = function ( token, callback ) {
      console.log('++++++++ checkOrganization ++++++++');

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

  exports.LI_login                        = function ( req, res ) {

      console.log('++++++++ LI_login ++++++++');
      var url = 'https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=75te23423gi7px&redirect_uri=http://localhost:3000/LIoauth&state=DCEeFW25345dfKef424&scope=r_basicprofile%20r_contactinfo';
      res.redirect(url);
    };

  exports.LI_oauth                        = function ( req, res ) {
      console.log('++++++++ LI_oauth ++++++++');
      console.log( "HEADER: ", req.headers );
      console.log( "QUERY: ", req.query );
      console.log( "BODY: ", req.body );

      // res.send( req.query );

      var data = { 'grant_type' : 'authorization_code',
                   'code' : req.query.code,
                   'redirect_uri' : 'http://localhost:5000/LIoauth',
                   'client_id' : '75t5325i7px',
                   'client_secret' : 'TWAq234523nZxywNR'
                  };

      var options = {
          uri: 'https://github.com/login/oauth/access_token',
          method: 'POST',
          // headers: { Accept: 'application/json' },
          form: data
      }

      request( options, function (error, response, body) {
        if (error) {
          console.log( error );
          res.send( error );
        } else {
          console.log( "BODY OF OAUTH", body);
          res.send( body );
        }
      });
    };

  exports.LI_userData                     = function ( req, res ) {
      console.log('++++++++ LI_userData ++++++++');
      console.log( "HEADER: ", req.headers );
      console.log( "QUERY: ", req.query );
      console.log( "BODY: ", req.body );

      var options = {
          uri: 'https://api.github.com/user',
          method: 'GET',
          headers:  { Accept: 'application/json',
                      'User-Agent' : 'HRX',
                      'Authorization' : 'token b414346235623562345234dfd9833827832' }
      }

      request( options, function (error, response, body) {
        console.log( "BODY OF githubdata", body);
        res.redirect('/');
      });

      // RESPONSE
    };

