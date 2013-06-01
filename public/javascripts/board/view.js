var Funbrella = Funbrella || {};
Funbrella.Messages = {send: function(message){console.log(message);return message;}}

Funbrella.addEl = function(el, url, callback){
  var loaded = null
    , element = document.createElement(el);
  if(el === 'script'){
    element.type = "text/javascript";
  }
  element.onload = function(){
    loaded = true;
    callback();
  };
  setTimeout(function(){
    if(loaded == null){
      callback(true);
    }
  },2000)
  element.src = url;
  document.getElementsByTagName("body")[0].appendChild(element);
};

Funbrella.BoardView = Backbone.View.extend({
  initialize: function(options){
    this.socket = options.board;
    this.collection = new Funbrella.Widgets();
    this.collection.url = '/boards/'+options.board;
    this.collection.fetch({ success: function(){
      this.render();
    }.bind(this)});
    $('#available-widgets li').draggable({
      helper:'clone',
      appendTo: 'body'
    });
  }
, template:   Hogan.compile('{{#board}}{{#widgets}}<div class="widget {{name}}" id="{{_id}}">loading... it up...</div>{{/widgets}}{{/board}}')
, render:     function(){
    var template = this.template.render({ board: this.collection.toJSON() });
    this.$el.html(template);
    this.runScript();
  }
, runScript: function(){
    this.collection.toJSON()[0].widgets.forEach(function(widget,i){
      Funbrella.addEl('script', '/widgets/'+widget.name+'/script.js'
    , function(err){
        if(widget.script === 'messageBoard'){
          Funbrella.Messages = new Funbrella[widget.script]({ model: widget , el: '#'+widget._id });
        }else if(!err){
          var w = new Funbrella[widget.script]({ model: widget , el: '#'+widget._id });
        }else{
          widget.prefs = [{fetch: false}];
          var s = new Funbrella.WidgetView({ el: '#'+widget._id, model: widget});
        }
      }.bind(this));
    }.bind(this));
  }
});
