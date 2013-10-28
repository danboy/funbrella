var Funbrella = Funbrella || {};

Funbrella.ctabus = Funbrella.WidgetView.extend({
  setup: function(){
    this.url = this.getUrl();
  }
, prefs: {
    urls: [ 'http://www.ctabustracker.com/bustime/api/v1/getpredictions?key=ET5WjsrDL2XZ9eD9qLVRiWuRq&rt=66&stpid=606']
  , startUrl: 0
  , strip: / \(Brown Line\)/g
  , frequency: 30
}
, config: {
  xml: true
}
, template: ctabus 
, getUrl: function(){
    this.url = (this.prefs.startUrl < this.prefs.urls.length-1) ? this.prefs.startUrl+1 : 0;
    return this.prefs.urls[this.prefs.startUrl];
  }
, data: function(data, cb){
    this.url = this.getUrl();
    var self = this;
    if(data['bustime-response'] == 0){
      var data = {stop: 'No upcoming busses.'};
    }else{
      var busses = data['bustime-response']['prd']
      if(!busses[0]){
        busses = [busses];
      }
      var data = {
        busses: self.cleanDate(busses)
      , stop: busses[0].stpnm.replace(self.prefs.strip, '')
      };
    }
    cb(data);
  }
, cleanDate: function(data){
    data = data.map(function(stop){
      var time = this.getDate(stop.prdtm);
      stop.arrival = (time > 0) ? time+' min' : 'now';
      if(stop.arrival == 'arriving')
        stop.arriving = true;
      return stop;
    }.bind(this));
    return data;
  }
, getDate: function(time){
    var iso = /^(\d{4})?(\d{2})?(\d{2})[T ]0?(\d+:\d+)$/;
    var date = time.replace(iso, "$2 $3 $1 $4");
    var arrival = new Date(date);
    var now = new Date();
    var minutesTil = Math.floor( ( arrival.getTime() - now.getTime() )/6e4 );
    return minutesTil;
  }
});
