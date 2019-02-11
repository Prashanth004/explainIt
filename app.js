var createError = require('http-errors');
var express = require('express');
const bodyParser = require('body-parser');
var path = require('path');
var ExpressPeerServer = require('peer').ExpressPeerServer;
var pgp = require('pg-promise')(options);
var cors = require('cors');
var debug = require('debug')('node-postgres-promises:server');
var http = require('http');
var promise = require('bluebird');
var port = normalizePort(process.env.PORT || '9000');
var logger = require('morgan');
var issueRouter = require('./routes/issues')
var twitterAuthRouter = require('./routes/auth')
var indexRouter = require('./routes/tech');
var usersRouter = require('./routes/users');
var projectRouter = require('./routes/project')
var basic = require('./routes/basic.routes')
const passport = require('passport');
require('./config/passport')(passport);


var options = {
    promiseLib: promise
};

var optionsForPeerjs = {
  debug: true
} 
const connectionString = {
    host: 'localhost',  
    port: 5432,
    database: 'toolArchi',
    user: 'postgres',
    password: 'postgres'
};




var app = express();
app.set('port', port);
var server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

app.set( 'view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));

// for data base
app.use(passport.initialize());
app.use(passport.session());
var db = pgp(connectionString);
console.log("db : ",db)

//cors 
app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//peerjs for screen sharing
app.use('/peerjs', ExpressPeerServer(server, optionsForPeerjs));
app.use(logger('dev'));

//body parsers
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//routes
app.use('/api/tech', indexRouter);
app.use('/api/twitter', twitterAuthRouter);
app.use('/api/users', usersRouter);
app.use('/api/project', projectRouter);
app.use('/api/issues',issueRouter);
app.use('/api/', basic );
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


exports.db = db;


//server console functions
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}



function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}



function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
