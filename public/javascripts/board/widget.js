var Funbrella = Funbrella || {};
Funbrella.Widget = Backbone.Model.extend({ url: '/widgets'});

Funbrella.Widgets = Backbone.Collection.extend({
    model:  Funbrella.Widget
});

Funbrella.WidgetView = Backbone.View.extend({
  initialize: function(options){
    this.model = new Funbrella.Widget(options.model)
    this.collection = new Funbrella.Widgets;
    this.prefs = $.extend( this.prefs, options.model.prefs[0]);
    this.setup();
    this.fetch();
    this.start();
    this.collection.bind('add', this.fetch, this);
  }
, start: function(){
    this.timer = setInterval(function(){this.fetch();}.bind(this), this.prefs.frequency*1000);
  }
, stop: function(){
    clearInterval(this.timer);
    this.timer = false;
  }
, events: {
  'click .prefs-button': 'togglePrefs'
, 'click .save': 'savePrefs'
}
, setup: function(){
}
, prefs: {
    interval: 60
  , xml: false
  }
, template: Hogan.compile("<h1>{{data}}</h1>")
, prefsTemplate: Hogan.compile('<form class="prefs">{{#prefs}}<div class="input"><label for="{{name}}">{{name}}</label><input name="{{name}}" data-type="{{type}}" value="{{value}}" /></div>{{/prefs}}<a name="save" class="btn save">save</a></form>')

, fetch: function(){
    var self = this;
    if(this.prefs.fetch == false){
      this.data({},function(data){self.render(data)});
      return true;
    };
    $.ajax(document.location.origin+'/fetch'
      , { type: 'POST'
      , data: {'url': self.url, xml: self.prefs.xml }
      , success: function(data){
        if(typeof(data) === 'string'){
          self.data(JSON.parse(data), function(data){self.render(data)});
        }else{
          self.data(data,function(data){self.render(data)});
        }
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
    this.$el.html(this.template.render(data));
    this.$el.append($('<a/>',{text: 'prefs', 'class': 'prefs-button'}))
    this.getPrefs();
  }
, savePrefs: function(){
    $('.prefs input').each(function(index,input){
      input = $(input);
      if(input.data('type') == 'object'){
        val = input.val().split(',');
      }else if(input.data('type') == 'boolean'){
        val = (input.val() == "true") ? true : false;
      }else{
        val = input.val();
      }
      this.prefs[$(input).attr('name')] = val;
    }.bind(this));
    this.model.set("prefs", this.prefs);
    this.model.save(function(err, r){console.log(err,r)});
    this.togglePrefs();
  }
, togglePrefs: function(){
  this.$el.find('.prefs').toggle();
  this.timer ? this.stop() : this.start();
}
, getPrefs: function(){
    var prefs = [];
    for( var pref in this.prefs ){
      prefs.push({ name: pref, value: this.prefs[pref] , type: typeof(this.prefs[pref])});
    }
    this.$el.append(this.prefsTemplate.render({prefs: prefs}));
  }
});
