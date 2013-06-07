var Funbrella = Funbrella || {};

Funbrella.dataClip = Funbrella.WidgetView.extend({
  prefs: {
    frequency: 60
  , title: ""
  , url: ""
  }
, requires: ['title', 'url']
, template: Hogan.compile('<h1>{{title}}</h1><h2>{{data}}</h2>')
, setup: function(){
    this.url = this.prefs.url;
  }
, data: function(data, cb){
    cb({title: this.prefs.title, data: data.values[0][0]})
  }
});
