//Import configure.js for settings
var configure = require('./configure');

//call configure.defaults() to set global variables
configure.defaults();
//call configure.mongoose() to configure mongoose
configure.mongoose();


var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var engine = require('ejs-mate');
var config = require('config');

var io = require('./api/shared/io');
var sanitizeInputs = require('./api/middlewares/sanitize');
var setApiVersion = require('./api/middlewares/check_api_version');

var routes = require('./main/routes/main');
var apiRoutes = require('./api/routes/index');



var app = express();

// use ejs-locals for all ejs templates:
app.engine('ejs', engine);

app.set('views',__dirname + '/main/views');
app.set('view engine', 'ejs'); // so you can render('index')
app.set('port', process.env.PORT || config.get('app.port'));


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//Set API_VERSION environment variables
app.use(setApiVersion);

//Sanitize user inputs
app.use(sanitizeInputs);

app.use('/', routes);
apiRoutes(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



var server = http.createServer(app);
io.attach(server);
server.listen(app.get('port'), function () {
  console.log('app listening on port',app.get('port'));
});
module.exports = app;