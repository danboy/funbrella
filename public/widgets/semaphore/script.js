var Funbrella = Funbrella || {};

Funbrella['semaphore'] = function(container, options){
  this.url = 0;
  this.options = $.extend( {
    urls: [ 'https://semaphoreapp.com/api/v1/projects/7a700eece71d476cf3e79f9b28ff4c85f936ecd9/28707/status?auth_token=bKYHFCwNyygF4U5RKY2z'
          , 'https://semaphoreapp.com/api/v1/projects/9591c6f39bba8e8238ee7f973de8ad9ee03c3c2c/22231/status?auth_token=bKYHFCwNyygF4U5RKY2z'
          , 'https://semaphoreapp.com/api/v1/projects/a19db27940d9828c281e2693e2728b47eaf66590/31155/status?auth_token=bKYHFCwNyygF4U5RKY2z' ]
  , alerts: false
  , status: 'failed'
  , sounds: {
      failed: [ '/widgets/semaphore/sounds/failed/1.ogg'
              , '/widgets/semaphore/sounds/failed/2.ogg'
              , '/widgets/semaphore/sounds/failed/3.ogg'
              , '/widgets/semaphore/sounds/failed/4.ogg'
              , '/widgets/semaphore/sounds/failed/5.ogg']
    , passed: [ '/widgets/semaphore/sounds/passed/1.ogg']
    , building: ['blank.ogg']
    }
  , timer: 20000
  }, options);
  var audio = this.options.audioUrls;
  this.container = container;
  this.fetch(this.render);
  setInterval(function(){
    this.fetch(this.render);
  }.bind(this), this.options.timer);
};

Funbrella.semaphore.prototype = {
  fetch: function(cb){
    var self = this;
    $.ajax(document.location.origin+'/fetch'
    , { type: 'POST'
      , data: {'url': self.getUrl() }
      , success: function(r){
          cb(JSON.parse(r), self);
          if(self.options.alerts)
            self.alertStatusChange(JSON.parse(r), self);
      }
    });
  }

, getUrl: function(){
    this.url = (this.url < this.options.urls.length-1) ? this.url+1 : 0;
    return this.options.urls[this.url];
  }

, template: Hogan.compile('<a name="ring" class="{{result}} ring"/><h1>{{project_name}}: <strong class="{{result}}">{{branch_name}}</strong></h1>{{#commit}}<h3>{{author_name}}</h3><p>{{message}}</p>{{/commit}}')

, render: function(data, self){
    var template = self.template.render(data);
    $(self.container).fadeOut(1000, function(){
      $(self.container).html(template).fadeIn(2000)
    });
  }
, alertStatusChange: function(data, self){
    var result = data.result
      , fail = self.options.sounds[result];

    if(result !== self.options.status ){
      self.options.status = result;
      var element = document.getElementsByTagName("audio")[0];
      if(element)
        element.parentNode.removeChild(element);
      Funbrella.addEl( 'audio', fail[Math.floor(Math.random()*fail.length)] );
      document.getElementsByTagName("audio")[0].play();
    }
  }

}
