var Funbrella = Funbrella || {};

Funbrella.ctabus = Funbrella.WidgetView.extend({
  setup: function(){
    this.url = this.getUrl();
  }
, prefs: {
    urls: [ 'http://www.ctabustracker.com/bustime/api/v1/getpredictions?key=ET5WjsrDL2XZ9eD9qLVRiWuRq&rt=66&stpid=606']
  , startUrl: 0
  , xml: true
  , strip: / \(Brown Line\)/g
  , frequency: 30
}
, template: Hogan.compile('<h1>{{{stop}}}</h1><img src="/widgets/ctabus/images/bus.png" /><table>{{#busses}}<tr {{#arriving}}class="arriving"{{/arriving}}><td>{{rtdir}} to {{des}}</td><td>{{arrival}}</td></tr>{{/busses}}</dl>')
, getUrl: function(){
    this.url = (this.prefs.startUrl < this.prefs.urls.length-1) ? this.prefs.startUrl+1 : 0;
    return this.prefs.urls[this.prefs.startUrl];
  }
, data: function(data, cb){
    this.url = this.getUrl();
    var self = this;
    var busses = data['bustime-response']['prd']
      , mustache = {
          busses: self.cleanDate(busses)
        , stop: busses[0].stpnm.replace(self.prefs.strip, '')
        };
    cb(mustache);
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
    var date = time.replace(iso, "$2 $3 $1 $4")
    var arrival = new Date(date);
    var now = new Date();
    var minutesTil = Math.floor( ( arrival.getTime() - now.getTime() )/6e4 );
    return minutesTil;
  }
})
