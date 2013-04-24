var Funbrella = Funbrella || {};

Funbrella.weather = Backbone.View.extend({
  initialize: function(options){

    this.options = $.extend( {
      key: "cdcab8b7f08c89677d0b5053b787bf0a"
    , location: "41.919932687221504,-87.71064193658447"
    , count: 10
    , frequency: 900
    }, options.model.params);

    //navigator.geolocation.getCurrentPosition(function(p){console.log(p)},function(e){console.log(e)});
    this.url = "https://api.forecast.io/forecast/"+this.options.key+"/"+this.options.location;
    this.fetch();
    setInterval(function(){this.fetch();}.bind(this), this.options.frequency*1000);
  }
, fetch: function(){
    var self = this;
    $.ajax({  url: this.url
            , dataType: "jsonp"
            , success: function(data){
              data.daily.data = data.daily.data.splice(0,4);
              self.render(data)
            }
    });
  }
, template: Hogan.compile('{{#currently}}<h1 class="climacon large {{icon}}"></h1><h2 class="temp">{{temperature}}<small>{{summary}}</small></h2>{{/currently}}{{#minutely}}<h3>{{summary}}</h3>{{/minutely}}<ul class="forecast">{{#daily.data}}<li class="icon"><h2>{{date.weekday_short}}</h2><figure class="climacon {{icon}}"><figcaption>{{temperatureMin}}/<strong>{{temperatureMax}}</strong></figcaption></figure></li>{{/daily.data}}</ul>')
, render: function(data){
    console.log(data);
    $('#'+this.model.id).html(this.template.render(data))
  }
});
