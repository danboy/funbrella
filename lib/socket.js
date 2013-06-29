Socket = {
  init: function(id, cb){
      var sockjs_opts = { sockjs_url: "http://majek.github.com/sockjs-client/sockjs-latest.min.js" };

      app.socketServers[id]  = sjs.createServer(sockjs_opts);

      app.socketServers[id].on('connection', function(conn) {

        app.socketServers[id].on('funbrella', function(m){
          conn.write(m.message);
        });

        conn.on('data', function(m){
          app.socketServers[id].emit('funbrella' , {message: m});
        });

        conn.on('close', function(c) {console.log('SOCKET CLOSED:',c)});

      });

      app.socketServers[id].installHandlers(server, {prefix:"[/]board/"+id});

      cb(app.socketServers[id]);
    }
}
module.exports = Socket;
