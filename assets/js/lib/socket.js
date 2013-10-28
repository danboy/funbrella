var Socket = function(socket, send){
  this.socketpath = socket;
  this.socket = new SockJS(socket);
  this.send = send;
  this.open(this.socket, this.send);
}

Socket.prototype = {
  open: function(socket, send){
    self = this;
    socket.onmessage = function(message){
      self.routeMessage(JSON.parse(message.data));
    }
    socket.onclose = function(e){
      console.log('SOCK CLOSED',self.socketpath, e);
      setTimeout(function(){
        self.socket = new SockJS(self.socketpath);
        window.socket = self.socket
        self.open(self.socket, self.send);
      },5000);
    }
  }
, routeMessage: function(message){
    if(message.type){
      self[message.type](message)
    }else{
      this.send(message);
    }
  }
, message: function(message){
    this.send(message);
  }
, popup: function(message){
    window.open(message.url, 'popup', 'fullscreen=yes,width=1600,height=900')
  }
}
