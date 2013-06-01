var Socket = function(socket, send){
  this.socket = new SockJS(socket);
  this.send = send;
  this.open();
}

Socket.prototype = {
  open: function(){
    self = this;
    this.socket.onmessage = function(message){
      console.log('RAW MESSAGE:',message);
      self.routeMessage(JSON.parse(message.data));
    }
    this.socket.onclose = self.open;
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
