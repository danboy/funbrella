var Funbrella = Funbrella || {};

Funbrella.semaphore = Funbrella.WidgetView.extend({
  prefs: {
    urls: [ 'https://semaphoreapp.com/api/v1/projects/7a700eece71d476cf3e79f9b28ff4c85f936ecd9/28707/status?auth_token=bKYHFCwNyygF4U5RKY2z'
          , 'https://semaphoreapp.com/api/v1/projects/7a700eece71d476cf3e79f9b28ff4c85f936ecd9/42382/status?auth_token=bKYHFCwNyygF4U5RKY2z'
          , 'https://semaphoreapp.com/api/v1/projects/9591c6f39bba8e8238ee7f973de8ad9ee03c3c2c/22231/status?auth_token=bKYHFCwNyygF4U5RKY2z'
          , 'https://semaphoreapp.com/api/v1/projects/a19db27940d9828c281e2693e2728b47eaf66590/31155/status?auth_token=bKYHFCwNyygF4U5RKY2z' ]
  , url: 0
  , token:  'bKYHFCwNyygF4U5RKY2z'
  , alerts: false
  , status: []
  , frequency: 20
  }
, getUrl: function(){
    this.url = (this.url < this.prefs.urls.length-1) ? this.url+1 : 0;
    return this.prefs.urls[this.url];
  }

, template: Hogan.compile('<a name="ring" class="{{result}} ring"/><h1>{{project_name}}: <strong class="{{result}}">{{branch_name}}</strong></h1>{{#commit}}<h3>{{author_name}}</h3><p>{{message}}</p>{{/commit}}')
, alertStatusChange: function(data, self){
    var result = data.result
      , project = data.project_name+data.branch_name;

    if(result !== self.prefs.status[project] ){
      self.prefs.status[project] = result;
      if(result == 'passed'){
        var message = data.project_name+' branch '+data.branch_name+' '+data.result+' thanks to '+data.commit.author_name;
      }
      else if(result == 'failed'){
        var message = data.commit.author_name+' broke '+data.project_name+' branch '+data.branch_name;
      }
      else{
        var message = data.commit.author_name+ ' pushed "'+data.message+'" to branch '+ data.branch_name + ' on '+ data.project_name
      }
      if(this.prefs.alerts){speak(message)};
      Funbrella.Messages.send({type: "semaphore "+data.result, sender: "semaphore", content: message })
    }
  }
, fetch: function(cb){
    var self = this;
    $.ajax(document.location.origin+'/fetch'
    , { type: 'POST'
      , data: {'url': self.getUrl() }
      , success: function(data){
        self.data(data,function(data){self.render(data)});
        self.alertStatusChange(JSON.parse(data), self);
      }
    });
  }
});
