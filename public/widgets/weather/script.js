var Funbrella = Funbrella || {};

Funbrella.weather = Funbrella.WidgetView.extend({
  setup: function(){
    this.url = "https://api.forecast.io/forecast/"+this.prefs.key+"/"+this.prefs.location;
  }
, prefs: {
    key: ""
  , location: ""
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
, getLocation: function(cb){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(cb);
  } else {
    cb(null);
  }
}
, template: Hogan.compile('{{#currently}}<h1 class="climacon large {{icon}}"></h1><h2 class="temp">{{temperature}}<small>{{summary}}</small></h2>{{/currently}}{{#minutely}}<h3>{{summary}}</h3>{{/minutely}}<ul class="forecast">{{#daily.data}}<li class="icon"><h2>{{date.weekday_short}}</h2><figure class="climacon {{icon}}"><figcaption>{{temperatureMin}}/<strong>{{temperatureMax}}</strong></figcaption></figure></li>{{/daily.data}}</ul><small class="weather-brand">powered by <a href="http://forecast.io">Forcast.io</a></small>')
});
