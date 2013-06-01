var Funbrella = Funbrella || {};

Funbrella.weather = Funbrella.WidgetView.extend({
  setup: function(){
    this.url = "https://api.forecast.io/forecast/"+this.prefs.key+"/"+this.prefs.location;
  }
, prefs: {
      key: "cdcab8b7f08c89677d0b5053b787bf0a"
    , location: "41.919932687221504,-87.71064193658447"
    , frequency: 900
}
, requires: ['key','location']
, data: function(data, cb){
    data.daily.data = data.daily.data.splice(0,4);
    data.currently.temperature = Math.round(data.currently.temperature)
    for (i=0;i < data.daily.data.length;i++){
      data.daily.data[i] = this.roundFloats(data.daily.data[i], ['temperatureMax','temperatureMin']);
    }
    cb(data)
    if(data.alerts){
      this.send(data.alerts);
    }
  }
, send: function(alerts){
    alerts.forEach(function(a){
      Funbrella.Messages.send({type: "weather", sender: "weather alert", content: a.title })
    });
  }
, roundFloats: function(data, fields){
  fields.forEach(function(field){
    data[field] = Math.round(data[field])
  });
  return data;
}
, template: Hogan.compile('{{#currently}}<h1 class="climacon large {{icon}}"></h1><h2 class="temp">{{temperature}}<small>{{summary}}</small></h2>{{/currently}}{{#minutely}}<h3>{{summary}}</h3>{{/minutely}}<ul class="forecast">{{#daily.data}}<li class="icon"><h2>{{date.weekday_short}}</h2><figure class="climacon {{icon}}"><figcaption>{{temperatureMin}}/<strong>{{temperatureMax}}</strong></figcaption></figure></li>{{/daily.data}}</ul>')
});
