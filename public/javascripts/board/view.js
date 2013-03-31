var Funbrella = Funbrella || {};

Funbrella.loadScript = function(url, callback){
  var script = document.createElement("script")
  script.type = "text/javascript";
    script.onload = function(){
      callback();
    };
  script.src = url;
  document.getElementsByTagName("body")[0].appendChild(script);
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
, template:   Hogan.compile('{{#widgets}}<div class="widget {{name}}" id="{{id}}">loading... it up...</div>{{/widgets}}')
, render:     function(){
    var template = this.template.render({ widgets: this.collection.toJSON() });
    this.$el.html(template);
    this.runScript();
  }
, runScript: function(){
    this.collection.toJSON().forEach(function(widget){
      Funbrella.loadScript('/widgets/'+widget.name+'/script.js'
    , function(){
        new Funbrella[widget.name]("#"+widget.id, widget.params, this.socket);
      }.bind(this));
    }.bind(this));
  }
});
