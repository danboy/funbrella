Funbrella.Watch = Funbrella.Watch || {};
Funbrella.Watch.dataClip = Funbrella.Watcher.extend({
  options: {
    frequency: 60
  , title: ""
  , url: ""
  }
, template: Hogan.compile('<div class="data-clip"><h2>{{title}}</h2><p>{{summary}}</p></div>')
, setup: function(){
    this.url = this.options.url;
  }
, data: function(data, cb){
    var clip = [];
    data.fields.forEach(function(d,i){
      clip.push({name: d, value: data.values[0][i]});
    });
    cb({title: this.prefs.title, data: data.values[0][0], d: clip})
  }
});
