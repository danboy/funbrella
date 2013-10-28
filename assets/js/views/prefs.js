//= require ./settings

Funbrella.PrefsView = function(options){
  if(options.type == 'watcher'){
    var prefs = new Funbrella.Watch[options.model.type]({el: '#prefs-form', model: options.model, stopped: true});
  }else{
    var prefs = new Funbrella[options.model.type]({el: '#prefs-form', model: options.model, stopped: true});
  }
  prefs.stop();
  prefs.$el.removeClass(options.model.type);
  prefs.fetchData = false;
  prefs.configure();
};
