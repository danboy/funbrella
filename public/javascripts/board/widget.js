var Funbrella = Funbrella || {};
Funbrella.Widget = Backbone.Model.extend({ url: '/widgets'});

Funbrella.Widgets = Backbone.Collection.extend({
    model:  Funbrella.Widget
});

Funbrella.WidgetView = Backbone.View.extend({
  initialize: function(options){
    this.model = new Funbrella.Widget(options.model)
    this.collection = new Funbrella.Widgets;
    this.prefs = $.extend( this.prefs, this.getArray(options.model));
    this.init();
    this.start();
    this.collection.bind('add', this.retrieveData, this);
  }
, getArray: function(object){
  return object.prefs
  }
, required: []
, start: function(){
    this.retrieveData();
    this.timer = setInterval(function(){this.retrieveData();}.bind(this), this.prefs.frequency*1000);
  }
, stop: function(){
    clearInterval(this.timer);
    this.timer = false;
  }
, retrieveData: function(){
    if(this.config.fetch == false){
      this.data('{"data": "no widget."}',function(data){this.render(data)}.bind(this));
    }else{
      this.fetch();
    }
  }
, init: function(){
    //for folks to add init stuff to.
  }
, prefs: {
    frequency: 60
  }
, config: {
    xml: false
  }
, template: Hogan.compile("<h1>Please add a widget.</h1>")
, fetch: function(){
    var self = this;
    $.ajax(document.location.origin+'/fetch'
      , { type: 'POST'
      , data: {'url': self.url, xml: self.config.xml, Authorization: self.prefs.authKey }
      , success: function(data){
        this.dataToObject(data,this);
      }.bind(this)
      , error: function(e){
        console.log('WIDGET.js fetch ERROR', self.url, e);
      }
    });
  }
, dataToObject: function(data, self){
    if(typeof(data) === 'string'){
      self.data(JSON.parse(data), function(data){self.render(data)});
    }else{
      this.data(data,function(data){self.render(data)});
    }
  }
, data: function(data, cb){
    if(typeof(data) === 'string'){
      cb(JSON.parse(data));
    }else{
      cb(data)
    }
  }
, render: function(data){
    this.unbind();
    var html = this.template.render(data);
    this.$el.html(html);
  }
, random: function(array){
    position = Math.floor((Math.random()*array.length));
    return array[position];
  }
});
