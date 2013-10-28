//= ./widget

Funbrella.Watcher = Funbrella.WidgetView.extend({
  template: watcher
, render: function(data){
    Funbrella.Messages.send(data);
  }
, addClass: function(){
    return true;
  }
});
