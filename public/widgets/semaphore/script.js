var Funbrella = Funbrella || {};

Funbrella['semaphore'] = function(container, options){
  this.url = 0;
  this.options = $.extend( {
    urls: [ 'https://semaphoreapp.com/api/v1/projects/7a700eece71d476cf3e79f9b28ff4c85f936ecd9/28707/status?auth_token=bKYHFCwNyygF4U5RKY2z'
          , 'https://semaphoreapp.com/api/v1/projects/9591c6f39bba8e8238ee7f973de8ad9ee03c3c2c/22231/status?auth_token=bKYHFCwNyygF4U5RKY2z'
          , 'https://semaphoreapp.com/api/v1/projects/a19db27940d9828c281e2693e2728b47eaf66590/31155/status?auth_token=bKYHFCwNyygF4U5RKY2z' ]
    , timer: 20000
  }, options);

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
      }
    });
  }

, getUrl: function(){
    this.url = (this.url < this.options.urls.length-1) ? this.url+1 : 0;
    return this.options.urls[this.url];
  }

, template: Hogan.compile('<h1><a name="ring" class="{{result}} ring"/>{{project_name}}: <strong class="{{result}}">{{branch_name}}</strong></h1>{{#commit}}<h3>{{author_name}}</h3><p>{{message}}</p>{{/commit}}')

, render: function(data,self){
    var template = self.template.render(data);
    $(self.container).fadeOut(1000, function(){
      $(self.container).html(template).fadeIn(2000)
    });
  }

}
