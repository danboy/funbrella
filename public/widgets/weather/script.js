var Funbrella = Funbrella || {};

Funbrella.weather = Funbrella.Widget.extend({
  initialize: function(options){

    this.options = $.extend( {
      key: "cdcab8b7f08c89677d0b5053b787bf0a"
    , location: "41.919932687221504,-87.71064193658447"
    , frequency: 900
    }, options.model.params);

    this.url = "https://api.forecast.io/forecast/"+this.options.key+"/"+this.options.location;
    this.fetch();
    setInterval(function(){this.fetch();}.bind(this), this.options.frequency*1000);
  }
, sanitize: function(data, cb){
    console.log(data);
    data.daily.data = data.daily.data.splice(0,4);
    cb(data)
  }
, template: Hogan.compile('{{#currently}}<h1 class="climacon large {{icon}}"></h1><h2 class="temp">{{temperature}}<small>{{summary}}</small></h2>{{/currently}}{{#minutely}}<h3>{{summary}}</h3>{{/minutely}}<ul class="forecast">{{#daily.data}}<li class="icon"><h2>{{date.weekday_short}}</h2><figure class="climacon {{icon}}"><figcaption>{{temperatureMin}}/<strong>{{temperatureMax}}</strong></figcaption></figure></li>{{/daily.data}}</ul>')
});
