var Funbrella = Funbrella || {};

Funbrella.bus = Backbone.View.extend({
  initialize: function(options){
    this.url = 0;
    this.options = $.extend( {
      urls: [ 'http://www.ctabustracker.com/bustime/api/v1/getpredictions?key=ET5WjsrDL2XZ9eD9qLVRiWuRq&rt=66&stpid=606']
    , strip: / &amp;&#35;40;Brown Line&#41;/g
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
, template: Hogan.compile('<h1>{{{stop}}}</h1><img src="/widgets/bus/images/bus.png" /><table>{{#busses}}<tr {{#arriving}}class="arriving"{{/arriving}}><td>{{rtdir}} to {{des}}</td><td>{{arrival}}</td></tr>{{/busses}}</dl>')
, getUrl: function(){
    this.url = (this.url < this.options.urls.length-1) ? this.url+1 : 0;
    return this.options.urls[this.url];
  }
, render: function(data, self){
    var data = JSON.parse(data)
      , busses = data['bustime-response']['prd']
      , mustache = {
          busses: self.cleanDate(busses)
        , stop: busses[0].stpnm.replace(self.options.strip, '')
        };
    var template = self.template.render(mustache);
    $('#'+self.model.id).html( template );
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
