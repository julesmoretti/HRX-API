//  server.js

//  set up ======================================================================
var port            = process.env.HRX_API_PORT || 5000,
// var port            = 5000,
    express         = require('express'),
    app             = express();
    app.use(express.static('.'));

//  load middleware =============================================================
    require('./middleware.js')(app);

//  routes ======================================================================
var router = express.Router();
    require('./routes.js')(router);
    app.use(router);

// launch ======================================================================
    app.listen(port);
    console.log('||||||||||||||||||||||||||||||||||||||||||||');
    console.log('============================================');
    console.log('HRX API started on port ' + port);
    console.log('--------------------------------------------');
