var Funbrella = Funbrella || {};
Funbrella.Widget = Backbone.Model.extend({ url: '/widgets'});

Funbrella.Widgets = Backbone.Collection.extend({
    model:  Funbrella.Widget
});

Funbrella.WidgetView = Backbone.View.extend({
  initialize: function(options){
    this.doFetch = true;
    this.model = new Funbrella.Widget(options.model)
    this.collection = new Funbrella.Widgets;
    this.prefs = $.extend( this.prefs, options.model.prefs[0]);
    this.setDropTarget();
    if(this.hasRequiredPrefs()){
      this.setup();
      this.doesFetch();
      this.start();
      this.collection.bind('add', this.doesFetch, this);
    }else{
      this.render({});
      this.togglePrefs();
    };
  }
, required: []
, random: function(array){
    position = Math.floor((Math.random()*array.length));
    return array[position];
  }
, start: function(){
    this.doesFetch();
    this.timer = setInterval(function(){this.doesFetch();}.bind(this), this.prefs.frequency*1000);
  }
, stop: function(){
    clearInterval(this.timer);
    this.timer = false;
  }
, doesFetch: function(){
    if(this.doFetch == false){
      this.data('{"data": "no widget."}',function(data){this.render(data)}.bind(this));
    }else{
      this.render({})
      this.fetch();
    }
  }
, events: {
  'click .prefs-button': 'togglePrefs'
, 'click .save': 'savePrefs'
}
, setup: function(){
    //for folks to add init stuff to.
  }
, prefs: {
    frequency: 60
  }
, config: {
    xml: false
  }
, requires: []
, hasRequiredPrefs: function(){
    var hasRequired = true;
    this.requires.forEach(function(required){
      if(this.prefs[required] == undefined || this.prefs[required] == ""){
        hasRequired = false;
      }
    }.bind(this));
    return hasRequired;
  }
, template: Hogan.compile("<h1>Please add a widget.</h1>")
, prefsTemplate: Hogan.compile('<form class="prefs">{{#prefs}}<div class="input"><label for="{{name}}">{{name}}</label><input name="{{name}}" data-type="{{type}}" value="{{value}}" /></div>{{/prefs}}<a name="save" class="btn save">save</a></form>')
, fetch: function(){
    var self = this;
    $.ajax(document.location.origin+'/fetch'
      , { type: 'POST'
      , data: {'url': self.url, xml: self.config.xml, Authorization: self.prefs.authKey }
      , success: function(data){
        if(typeof(data) === 'string'){
          self.data(JSON.parse(data), function(data){self.render(data)});
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
    this.$el.html(this.template.render(data));
    this.$el.append($('<a/>',{text: '\u2217', 'class': 'prefs-button'}))
    this.getPrefs();
  }
, setDropTarget: function(){
    this.$el.droppable({drop: function(w){
      this.updateWidget($(w.toElement).data('widget'));
    }.bind(this)})
  }
, updateWidget: function(widget){
    this.model.unset('prefs');
    this.model.save(widget, {
      success: function(err, r){
        location.reload();
      }, error: function(m,e,o){
        location.reload();
      }});
  }
, savePrefs: function(){
    this.$el.find('.prefs input').each(function(index,input){
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
    var prefs = this.prefs;
    this.model.set("prefs", prefs);
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
      if( pref == 'fetch'){
        return;
      }else{
        prefs.push({ name: pref, value: this.prefs[pref] , type: typeof(this.prefs[pref])});
      }
    }
    this.$el.append(this.prefsTemplate.render({prefs: prefs}));
  }
});
