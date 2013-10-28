//= require 'widget'
var Funbrella = Funbrella || {};

Funbrella.messageBoard = Funbrella.WidgetView.extend({
  prefs: {
    frequency: 1
  }
, template: messageBoard
, send: function(message){
    var stick = message.stickFor || 0;
    message.timestamp = this.stickyFor(new Date(),stick);
    var m = this.collection.push(message);
  }
, setup: function(){
    this.fetchData = false;
    this.collection = new Funbrella.Widgets()
    this.collection.comparator = function(message){
      return -message.get('timestamp').getTime();
    }
    this.addMessageForm();
  }
, data: function(data, cb){
    this.collection.sort();
    cb({time: this.getTime(), messages: this.collection.toJSON()});
  }
, stickyFor: function(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
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
, messageTemplate: messageTemplate
, addMessageForm: function(){
    $('body').append(this.messageTemplate());
    $('#message .send').click(function(){
      sock.socket.send(JSON.stringify({ content: $('#message textarea').val(), stickFor: $('#message input[name=sticky]').val() }));
      $('#message textarea').val('')
    });
  }
});
