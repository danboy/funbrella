var Funbrella = Funbrella || {};

Funbrella.pivotal = Funbrella.WidgetView.extend({
  template: pivotal
, prefs: {
      token: ''
    , frequency: 300
    , projects: ['414007']
  }
, requires: ['token']
, setup: function(){
    this.url = 'https://www.pivotaltracker.com/services/v5/projects/'+this.prefs.projects[0]
    this.headers = {'X-Tracker-Token': this.prefs.token}
    //'1639047a6c20f2f8c4767ca363167162'
  }
, data: function(data, cb){
    var self = this;
    var stories = this.url+'/stories?filter=state:started,finished,delivered,accepted';
    $.ajax(document.location.origin+'/fetch'
      , { type: 'POST'
      , data: {'url': stories, xml: false, _csrf: window._csrf, Authorization: self.prefs.headers }
      , success: function(stories){
        data.stories = JSON.parse(stories);
        cb(data);
      }
      , error: function(e){
        console.log('WIDGET.js ERROR', self.url, e);
      }
    });
  }
});
