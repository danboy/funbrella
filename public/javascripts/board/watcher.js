var Funbrella = Funbrella || {};

Funbrella.Watcher = Backbone.View.extend({
  initialize: function(options){
    this.options = $.extend( this.options, options.model.params);
    this.setup();
    this.fetch();
    setInterval(function(){this.fetch();}.bind(this), this.options.frequency*1000);
  }
, setup: function(){
  return true;
}
, options: {
    frequency: 10
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
    Funbrella.Messages.send(data);
  }
});
