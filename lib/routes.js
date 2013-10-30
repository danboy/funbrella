var Socket = require('../lib/socket');

var CreateSocket = function(req,res,next){
  if(!app.socketServers[req.params.id]){
    Socket.init(req.params.id, function(socket){
      return true;
    })
  }
  next();
}
var csrf = function(req, res, next){
  res.locals._csrf = req.csrfToken();
  next();
}
var locals = function(req, res, next){
  res.locals.title = 'Funbrella';
  next();
}

module.exports = function(app, routes) {
  app.get('*', locals);

  app.get('/', routes.Home.index);
  app.post('/fetch', csrf, routes.Get.fetch);
  app.post('/ping', csrf, routes.Get.ping);
  app.get('/users/:id', routes.Users.show);
  app.get('/profile/:id', routes.Users.show);
  app.post('/boards', csrf, routes.Boards.create);
  app.get('/boards/new', csrf, routes.Boards.new);
  app.get('/boards/:id', csrf, CreateSocket, routes.Boards.show);
  app.get('/boards/:id/edit', csrf, routes.Boards.edit);
  app.post('/widgets/update-prefs', csrf, routes.Widgets.prefs);
  app.post('/widgets', csrf, routes.Widgets.create);
  app.get('/widgets/:id', csrf, routes.Widgets.edit);
  app.get('/widgets/:id/:type', csrf, routes.Widgets.edit);
  app.post('/widgets/:id', csrf, routes.Widgets.update);
  app.post('/watchers', csrf, routes.Watchers.create);
}
