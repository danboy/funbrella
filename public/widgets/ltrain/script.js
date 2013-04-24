var Funbrella = Funbrella || {};

Funbrella.ltrain = Funbrella.Widget.extend({
  initialize: function(options){

  this.url = 0;
  this.options = $.extend( {
    urls: [ 'http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?key=3654c77e9dcd4acaa89b6e5ded7fbf86&max=5&mapid=40710']
  , timer: 30000
  }, options.model.params);
  this.fetch(this.render);
  setInterval(function(){
    this.fetch(this.render);
  }.bind(this), this.options.timer);
  }
, fetch: function(cb){
    var self = this;
    $.ajax(document.location.origin+'/fetch'
    , { type: 'POST'
      , data: {'url': self.getUrl(), xml: true }
      , success: function(r){
          cb(r, self);
      }
    });
  }
, template: Hogan.compile('<h1>{{{name}}}</h1><img src="/widgets/ltrain/images/train.png" /><table>{{#trains}}<tr class="{{rt}}"><td>{{stpDe}}</td><td>{{arrival}}</td></tr>{{/trains}}</dl>')
, getUrl: function(){
    this.url = (this.url < this.options.urls.length-1) ? this.url+1 : 0;
    return this.options.urls[this.url];
  }
, render: function(data, self){
    var trains = JSON.parse(data)
      , station = {
        trains: self.cleanDate(trains.ctatt.eta)
      , name: trains.ctatt.eta[0].staNm
    };
      window.trains = trains;
    var template = self.template.render(station)
    $('#'+self.model.id).html( template );

  }
, cleanDate: function(data){
    data = _.map(data,function(stop){
      var time = this.getDate(stop.arrT);
      stop.arrival = (time > 0) ? time+' min' : 'now';
      if(stop.arrival == 'arriving')
        stop.arriving = true;
      return stop;
    }.bind(this));
    return data;
  }
, getDate: function(time){
    var iso = /^(\d{4})?(\d{2})?(\d{2})[T ]0?(\d+:\d+:\d+)$/;
    var date = time.replace(iso, "$2 $3 $1 $4")
    var arrival = new Date(date);
    var now = new Date();
    var minutesTil = Math.floor( ( arrival.getTime() - now.getTime() )/6e4 );
    return minutesTil;
  }
});
