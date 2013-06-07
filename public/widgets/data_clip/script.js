var Funbrella = Funbrella || {};

Funbrella.dataClip = Funbrella.WidgetView.extend({
  prefs: {
    frequency: 60
  , title: ""
  , url: ""
  }
, requires: ['title', 'url']
, template: Hogan.compile('<h1>{{title}}</h1><table>{{#d}}<tr><td>{{name}}</td><td>{{value}}</td></tr>{{/d}}</table>')
, setup: function(){
    this.url = this.prefs.url;
  }
, data: function(data, cb){
    var clip = [];
    console.log(data);
    data.fields.forEach(function(d,i){
      clip.push({name: d, value: data.values[0][i]});
    });
    console.log(clip);
    cb({title: this.prefs.title, data: data.values[0][0], d: clip})
  }
});
