var Funbrella = Funbrella || {};

Funbrella['socket'] = function(container, options, board){
  this.lastPost = {};
  this.container = container;
  Funbrella.addEl('script','http://cdn.sockjs.org/sockjs-0.3.min.js', function(){
    this.sock = new SockJS(document.location.origin+'/socket/'+board, null, {debug:true});
    this.init();
  }.bind(this));
}

Funbrella.socket.prototype = {
  init: function(){
    this.sock.onopen = function(){
      console.log('open');
    };
    this.sock.onclose = function(e){
      console.log('closed',e);
    };
    this.sock.onmessage = function(m){
      console.log("MESSAGE:",m);
    };
  }
};
