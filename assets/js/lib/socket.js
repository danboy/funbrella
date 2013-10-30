var Socket = function(socket, send){
  this.socketpath = socket;
  this.send = send;
  this.createSocket();
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
        self.createSocket();
      },5000);
    }
  }
, createSocket: function(){
  console.log('SOCKETPATH',this.socketpath);
  this.socket = new SockJS(this.socketpath);
  this.open(this.socket, this.send);
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
