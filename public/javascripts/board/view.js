var Funbrella = Funbrella || {};

Funbrella.addEl = function(el, url, callback){
  var element = document.createElement(el);
  if(el === 'script'){
    element.type = "text/javascript";
  }
  element.onload = function(){
    callback();
  };
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
    , function(){
        if(widget.script === 'messageBoard'){
          Funbrella.Messages = new Funbrella[widget.script]({ model: widget , el: '#'+widget._id });
        }else{
          var w = new Funbrella[widget.script]({ model: widget , el: '#'+widget._id });
        }
      }.bind(this));
    }.bind(this));
  }
});
