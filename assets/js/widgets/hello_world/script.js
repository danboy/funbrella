var Funbrella = Funbrella || {};

Funbrella.hello_world = Funbrella.WidgetView.extend({
  template: helloWorld
, setup: function(){
    this.fetchData = false;
  }
, data: function(data, cb){
    cb({message: 'Hello world.'})
  }
});
