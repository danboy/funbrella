var Funbrella = Funbrella || {};

Funbrella.semaphore = Funbrella.WidgetView.extend({
  prefs: {
    urls: []
  , url: 0
  , token:  ''
  , audioAlerts: false
  , status: []
  , frequency: 20
  }
, requires: ['urls', 'token']
, help: {
    title: 'I need some settings'
  , description: 'I need your project and branch id from semaphore to work. Go to semaphore and check you project api for more'
  , link: {url: 'https://semaphoreapp.com/', text: 'visit semaphore'}
  }
, getUrl: function(){
    this.prefs.url = (this.prefs.url < this.prefs.urls.length-1) ? this.prefs.url+1 : 0;
    this.url = 'https://semaphoreapp.com/api/v1/projects/'+this.prefs.urls[this.prefs.url]+'/status?auth_token='+this.prefs.token;
  }
, setup: function(){
    this.getUrl();
  }
, template: semaphore
, alertStatusChange: function(data){
    var result = data.result
      , project = data.project_name+data.branch_name;
    if(!this.prefs.status[project]){
      this.prefs.status[project] = result;
    }
    if(result !== this.prefs.status[project] ){
      this.prefs.status[project] = result;
      if(result == 'passed'){
        var message = data.project_name+' branch '+data.branch_name+' '+data.result+' thanks to '+data.commit.author_name;
      }
      else if(result == 'failed'){
        var message = data.commit.author_name+' broke '+data.project_name+' branch '+data.branch_name;
      }
      else{
        var message = data.commit.author_name+ ' pushed "'+data.commit.message+'" to branch '+ data.branch_name + ' on '+ data.project_name
      }
      if(this.prefs.audioAlerts){speak(message)};
      Funbrella.Messages.send({type: "semaphore "+data.result, sender: "semaphore", content: message })
    }
  }
, data: function(data, cb){
    this.getUrl();
    this.alertStatusChange(data);
    cb(data);
  }
});
