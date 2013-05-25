var Funbrella = Funbrella || {};

Funbrella.messageBoard = Funbrella.WidgetView.extend({
  prefs: {
    frequency: 300
  , fetch: false
  }
, template: Hogan.compile('<h1 class="clock">{{time}}</h1><ul class="message-list">{{#messages}}<li class="{{type}}">{{#sender}}<strong>{{sender}}:</strong> {{/sender}}{{{content}}}</li>{{/messages}}</ul>')
, send: function(message){
    message.timestamp = new Date();
    var m = this.collection.push(message);
  }
, setup: function(){
    this.collection.comparator = function(message){
      return -message.get('timestamp').getTime();
    }
  }
, data: function(data, cb){
    this.collection.sort();
    cb({time: this.getTime(), messages: this.collection.toJSON()});
  }
, getTime: function(time){
    var time = time || new Date()
      , date    = new Date(time)
      , hour    = date.getHours()
      , minutes = date.getMinutes();
    if(hour > 12){
      hour = hour - 12;
    }
    String.prototype.fatten = function(){
      if(this < 10){
         return "0"+this;
      }else{
        return this;
      }
    }
    var time = hour.toString().fatten()+":"+minutes.toString().fatten();
    if(this.prefs.showSeconds)
      time = time + date.getSeconds().toString().fatten();
    return time;
  }
});
