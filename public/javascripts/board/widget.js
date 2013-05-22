var Funbrella = Funbrella || {};
Funbrella.Widget = Backbone.Model.extend({});

Funbrella.Widgets = Backbone.Collection.extend({
    model:  Funbrella.Widget
});

Funbrella.WidgetView = Backbone.View.extend({
  initialize: function(options){
    this.collection = new Funbrella.Widgets;
    this.options = $.extend( this.options, options.model.params);
    this.fetch();
    setInterval(function(){this.fetch();}.bind(this), this.options.frequency*1000);
    this.collection.bind('add', this.fetch, this);
  }
, options: {
    interval: 60
  }
, template: Hogan.compile("<h1>{{data}}</h1>")

, fetch: function(){
    var self = this;
    if(this.options.fetch == false){
      this.data({},function(data){self.render(data)});
      return true;
    };
    $.ajax({  url: this.url
            , dataType: "jsonp"
            , success: function(data){
              self.data(data,function(data){self.render(data)});
            }
    });
  }
, data: function(data, cb){
    if(typeof(data) === 'string'){
      cb(JSON.parse(data));
    }else{
      cb(data)
    }
  }
, render: function(data){
    this.$el.html(this.template.render(data)).append(this.prefs);
  }
});
