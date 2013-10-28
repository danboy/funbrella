//= require settings

Funbrella.WidgetView = Funbrella.SettingsView.extend({
  setup: function(){
    return true;
  }
, retrieveData: function(){
    if(this.fetchData == false){
      this.data('{"data": "no widget."}',function(data){this.render(data)}.bind(this));
    }else{
      this.fetch();
    }
  }
, start: function(){
    this.retrieveData();
    this.timer = setInterval(function(){this.retrieveData();}.bind(this), this.prefs.frequency*1000);
  }
, stop: function(){
    clearInterval(this.timer);
    this.timer = false;
  }
, fetch: function(){
    var self = this;
    $.ajax(document.location.origin+'/fetch'
      , { type: 'POST'
      , data: {'url': self.url, xml: self.config.xml, _csrf: window._csrf, Authorization: self.prefs.authKey }
      , success: function(data){
        if(typeof(data) === 'string'){
          try{
            self.data(JSON.parse(data), function(data){self.render(data)});
          }catch(e){
            console.log('ERROR', e, 'response', JSON.parse(data), 'type', typeof(data));
            self.configure();
          };
        }else{
          self.data(data,function(data){self.render(data)});
        }
      }
      , error: function(e){
        console.log('WIDGET.js ERROR', self.url, e);
      }
    });
  }
, data: function(data, cb){
    if(typeof(data) === 'string'){
      cb(JSON.parse(data));
    }else{
      cb(data)
    }
  }
, render: function(data){
    this.$el.html(this.template(data));
  }
});
