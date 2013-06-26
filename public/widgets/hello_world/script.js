var Funbrella = Funbrella || {};

Funbrella.helloWorld = Funbrella.WidgetView.extend({
  template: Hogan.compile('<h1>{{message}}</h1>')
, config: {
    fetch: false
  }
, data: function(data, cb){
    cb({message: 'Hello world.'})
  }
});
