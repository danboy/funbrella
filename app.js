var express     = require('express')
  , everyauth   = require('everyauth')
  , controllers = require('./lib/controllers')
  , http        = require('http')
  , MongoStore = require('connect-mongo')(express)
  , h4e         = require('h4e')
  , path        = require('path')
  , mongoose    = require('mongoose')
  , app         = express()
  , server      = http.createServer(app);

global.nap = require('nap');

app.configure('production', function(){
  app.db = 'mongodb://funbrella:koCbUkLM5@dharma.mongohq.com:10064/funbrella'
});

app.configure('development', function(){
  app.db = 'mongodb://localhost/funbrella'
});

mongoose.connect(app.db);

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

global.sjs = require('sockjs');
global.app = app;
global.server = server;

app.configure('development', function(){
  app.use(express.errorHandler());
});
nap({
  assets: {
    js: {
      scripts: [
        '/public/coffeescripts/**/*',
      ]
    },
    jst: {
      templates: [
        '/public/javascripts/templates/*'
      ]
    }
  }
})
require('./lib/routes')(app, controllers)

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
