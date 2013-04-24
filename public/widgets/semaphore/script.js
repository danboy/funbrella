var Funbrella = Funbrella || {};

Funbrella.semaphore = Backbone.View.extend({
  initialize: function(options){
    this.model = options.model;
    this.options = $.extend( {
      urls: [ 'https://semaphoreapp.com/api/v1/projects/7a700eece71d476cf3e79f9b28ff4c85f936ecd9/28707/status?auth_token=bKYHFCwNyygF4U5RKY2z'
            , 'https://semaphoreapp.com/api/v1/projects/9591c6f39bba8e8238ee7f973de8ad9ee03c3c2c/22231/status?auth_token=bKYHFCwNyygF4U5RKY2z'
            , 'https://semaphoreapp.com/api/v1/projects/a19db27940d9828c281e2693e2728b47eaf66590/31155/status?auth_token=bKYHFCwNyygF4U5RKY2z' ]
    , url: 0
    , token:  'bKYHFCwNyygF4U5RKY2z'
    , alerts: false
    , status: 'failed'
    , frequency: 20
    }, options.model.params);

    this.fetch(this.render);
    setInterval(function(){
      this.fetch(this.render);
    }.bind(this), this.options.frequency*1000);
  }
, getUrl: function(){
    this.url = (this.url < this.options.urls.length-1) ? this.url+1 : 0;
    return this.options.urls[this.url];
  }

, template: Hogan.compile('<a name="ring" class="{{result}} ring"/><h1>{{project_name}}: <strong class="{{result}}">{{branch_name}}</strong></h1>{{#commit}}<h3>{{author_name}}</h3><p>{{message}}</p>{{/commit}}')
, alertStatusChange: function(data, self){
    var result = data.result;

    if(result !== self.options.status ){
      self.options.status = result;
      if(result == 'passed'){
        speak(data.project_name+' branch '+data.branch_name+' '+data.result+' thanks to '+data.commit.author_name)
      }
      if(result == 'failed'){
        speak(data.commit.author_name+' broke '+data.project_name+' branch '+data.branch_name)
      }
    }
  }
, fetch: function(cb){
    var self = this;
    $.ajax(document.location.origin+'/fetch'
    , { type: 'POST'
      , data: {'url': self.getUrl() }
      , success: function(r){
          cb(JSON.parse(r), self);
          self.alertStatusChange(JSON.parse(r), self);
      }
    });
  }
, render: function(data,self){
    $('#'+self.model.id).html(self.template.render(data))
  }

});
