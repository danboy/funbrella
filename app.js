var express = require('express');
var http = require('http');
var path = require('path')
  , everyauth = require('everyauth')
  , controllers = require('./lib/controllers')
  , MongoStore = require('connect-mongo')(express)
  , mongoose = require('mongoose');


var app = express();

auth = require('./lib/auth.js').init(everyauth, app.get('env'));
app.configure('production', function(){
  app.db = 'mongodb://funbrella:koCbUkLM5@dharma.mongohq.com:10064/funbrella'
});

app.configure('development', function(){
  app.db = 'mongodb://localhost/funbrella'
});

mongoose.connect(app.db);

app.locals.title = 'Funbrella'

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride())
app.use(express.cookieParser('what secret'));
app.use(express.session({
      secret: 'egg mcMuffin'
    , store: new MongoStore({
        db: mongoose.connections[0].db
      })
    }))
  .use(everyauth.middleware())
  .use(require('connect-assets')({jsCompilers: require('./lib/jade-assets')}))
  .use(express.csrf())
  .use(app.router)
  .use(express.static(path.join(__dirname, 'public')))

global.sjs = require('sockjs');
global.app = app;
global.server = http.createServer(app);
app.socketServers = {};

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
  app.use(express.errorHandler());

require('./lib/routes')(app, controllers)

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
