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
  }
, data: function(data, cb){
    var self = this;
    var stories = this.url+'/stories';
    $.ajax(document.location.origin+'/fetch'
      , { type: 'POST'
      , data: {'url': stories, xml: false, _csrf: window._csrf, Authorization: self.prefs.headers }
      , success: function(stories){
        data.stories = JSON.parse(stories);
        self.getStats(data,cb);
      }
      , error: function(e){
        console.log('WIDGET.js ERROR', self.url, e);
      }
    });
  }
, getStats: function(data, cb){
    var totalPoints = 0
      , finished = 0
      , remainingPoints = 0
      , add = this.addPoints;
    data.stories.forEach(function(story, index){
      var points = add(story.estimate);
      if(story.estimate){
        totalPoints = totalPoints+story.estimate;
      }
      (['unstarted', 'started'].indexOf(story.current_state) == -1) ? finished++ : remainingPoints = remainingPoints+points;
      if(data.stories.length == index+1){
        data.totalPoints = totalPoints;
        data.remainingPoints = remainingPoints;
        data.finished = finished;
        cb(data);
      }
    });
  }
, addPoints: function(estimate){
    if(estimate == undefined){estimate = 0};
    return estimate;
  }
});
