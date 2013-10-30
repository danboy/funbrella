var Funbrella = Funbrella || {};

Funbrella.semaphore = Funbrella.WidgetView.extend({
  prefs: {
    urls: []
  , url: 0
  , token:  ''
  , audioAlerts: false
  , frequency: 20
  }
, requires: ['urls', 'token']
, help: {
    title: 'I need some settings'
  , description: 'I need your project and branch id from semaphore to work. Go to semaphore and check you project api for more'
  , link: {url: 'https://semaphoreapp.com/', text: 'visit semaphore'}
  }
, getUrl: function(){
    this.prefs.url = (this.prefs.url < this.prefs.urls.length-1) ? parseInt(this.prefs.url)+1 : 0;
    this.url = 'https://semaphoreapp.com/api/v1/projects/'+this.prefs.urls[this.prefs.url]+'/status?auth_token='+this.prefs.token;
  }
, setup: function(){
    this.getUrl();
  }
, template: semaphore
, data: function(data, cb){
    this.getUrl();
    $.ajax(document.location.origin+'/fetch'
      , { type: 'POST'
      , data: {'url': data.branch_history_url, xml: false, _csrf: window._csrf }
      , success: function(history){
        data.history = JSON.parse(history);
        cb(data);
      }
      , error: function(e){
        console.log('WIDGET.js ERROR', self.url, e);
      }
    });
  }
});
