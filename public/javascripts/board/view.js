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
  events: {
    'click .widget': 'showConfig'
  }
, initialize: function(options){
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
      Funbrella.addEl('script', '/widgets/'+widget.name+'/script.js'
    , function(){
        new Funbrella[widget.name]({ model: widget });
      }.bind(this));
      this.setConfig(widget);
    }.bind(this));
  }
, setConfig: function(widget){
    widget.prefs = $('#widget-prefs-'+widget.id)
    $('#'+widget.id).append(widget.prefs.html())
    console.log(widget.id);
  }
, showConfig: function(e){
    console.log(e);
  }
});
