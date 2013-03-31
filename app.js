var express   = require('express')
  , controllers    = require('./lib/controllers')
  , http      = require('http')
  , sockjs    = require('sockjs')
  , h4e       = require('h4e')
  , path      = require('path')
  , mongoose  = require('mongoose');

var app = express();

mongoose.connect('mongodb://localhost/funbrella');

h4e.setup({
  app: app
, extension: 'hjs'
, baseDir: __dirname+'/views'
, toCompile: ['tests', 'js','header']
});

app.socketServers = {};

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

global.app = app;

app.configure('development', function(){
  app.use(express.errorHandler());
});

require('./lib/routes')(app, controllers)

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
