var Funbrella = Funbrella || {};

Funbrella.weather = function(container, options){
    this.options = $.extend( {
      key: "5b43b6f707668880"
    , zip: "60647"
    , count: 10
    , timer: 900000
    }, options);
    this.container = container;
    this.options.url = "http://api.wunderground.com/api/"+this.options.key+"/conditions/forecast/q/"+this.options.zip+".json"

    this.fetch();
    setInterval(function(){this.fetch();}.bind(this), this.options.timer);
}
Funbrella.weather.prototype = {
  fetch: function(){
    var self = this;
    $.ajax({  url: this.options.url
            , dataType: "jsonp"
            , success: function(data){
              self.buildFragment(data.current_observation, data.forecast.simpleforecast, function(fragment){
                $(self.container).html(fragment);
              });
            }
    });
  }
, template: Hogan.compile('<h1 class="climacon large">{{icon}}</h1><h2 class="temp">{{temp_f}} <small>{{weather}}</small></h2>')
, buildFragment: function( current, fc , cb ){
    current.icon =  this.getIcon(current.icon);
    cb(this.template.render(current));
    this.getForecast(fc);
  }
, getIcon: function(icon, time){
    var time = time || 'day';
    var iconMap = { 'chancerain': "'"
                , 'chancetstorms': 'z'
                , 'chancesnow': '9'
                , 'chanceflurries': ':'
                , 'chancesleet': '*'
                , 'clear': 'I'
                , 'sunny': 'I'
                , 'rain': '0'
                , 'mostlysunny': '"'
                , 'partlycloudy':'"'
                , 'partlysunny': '"'
                , 'mostlycloudy': '!'
                , 'fog': '<'
                , 'hazy': '<'
                , 'overcast': '?'
                , 'unknown': '?'
                , 'cloudy': '!'
                , 'snow': '9'
                , 'flurries': '9'
                , 'sleet': '*'
                , 'tstorms': '3' };
    return iconMap[icon];

  }
, forecastTemplate: Hogan.compile('<ul class="forecast">{{#days}}<li class="icon"><h2>{{date.weekday_short}}</h2><figure class="climacon">{{icon}}<figcaption>{{low.fahrenheit}}/<strong>{{high.fahrenheit}}</strong></figcaption></figure></li>{{/days}}</ul>')
, getForecast: function(fc){
    f = _.map(fc.forecastday,function(d){
      d.icon = this.getIcon(d.icon);
      return d;
    }.bind(this));
    var forecast = this.forecastTemplate.render({days: f});
    $(this.container).append(forecast);
  }
}
