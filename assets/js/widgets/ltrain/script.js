var Funbrella = Funbrella || {};

Funbrella.ltrain = Funbrella.WidgetView.extend({
  prefs: {
    urls: [ 'http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?key=3654c77e9dcd4acaa89b6e5ded7fbf86&max=5&mapid=40710']
  , frequency: 30
  }
, config: {
    xml: true
  }
, setup: function(){
    this.url = this.getUrl();
    console.log('setup')
  }
, template: ltrain
, getUrl: function(){
    this.url = (this.url < this.prefs.urls.length-1) ? this.url+1 : 0;
    return this.prefs.urls[this.url];
  }
, data: function(data, cb){
    var trains = data.ctatt.eta
    var self = this
      , station = {
          trains: self.cleanDate(trains)
        , name: trains[0].staNm
      };
    cb(station);
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
