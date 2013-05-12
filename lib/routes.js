var Socket = require('../lib/socket');

var CreateSocket = function(req,res,next){
  if(!app.socketServers[req.params.id]){
    Socket.init(req.params.id, function(socket){
      console.log(socket);
    })
  }
  next();
}

module.exports = function(app, routes) {
  app.post('/fetch', routes.Get.fetch);
  app.post('/boards', routes.Board.create)
  app.get('/', routes.Board.index);
  app.get('/boards/new', routes.Board.new)
  app.get('/boards/send', routes.Board.message)
  app.post('/boards/send', routes.Board.send)
  app.get('/boards/:id', CreateSocket, routes.Board.show)
  app.get('/static', routes.Board.static)
  app.get('/messages', routes.Message.index)
  app.get('/messages/new', routes.Message.new)
  app.post('/messages', routes.Message.create)

  app.get('/widgets/generate', routes.Widget.generate)
}
