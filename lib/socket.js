var sockjs = require('sockjs')
Socket = {
  init: function(id, cb){
      var sockjs_opts = { sockjs_url: "http://majek.github.com/sockjs-client/sockjs-latest.min.js" };
      app.socketServers[id]  = sockjs.createServer(sockjs_opts);
      app.socketServers[id].on('connection', function(conn) {
        console.log('CONNECT:',conn);

        conn.on('data', function(m){
          console.log(m);
        });
      });

      app.socketServers[id].installHandlers(app, {prefix:"[/]board/"+id});

      cb(app.socketServers[id]);
    }
}
module.exports = Socket;
