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
    this.setup();
    this.doesFetch();
    this.setDropTarget();
    this.collection.bind('add', this.doesFetch, this);
  }
, random: function(array){
    position = Math.floor((Math.random()*array.length));
    return array[position];
  }
, start: function(){
    this.timer = setInterval(function(){this.get();}.bind(this), this.prefs.frequency*1000);
  }
, stop: function(){
    clearInterval(this.timer);
    this.timer = false;
  }
, doesFetch: function(){
    if(this.doFetch == false){
      console.log('skip fetch');
      this.data('{"data": "no widget."}',function(data){this.render(data)}.bind(this));
    }else{
      this.fetch();
    }
    this.start();
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
  , xml: false
  }
, template: Hogan.compile("<h1>Please add a widget.</h1>")
, prefsTemplate: Hogan.compile('<form class="prefs">{{#prefs}}<div class="input"><label for="{{name}}">{{name}}</label><input name="{{name}}" data-type="{{type}}" value="{{value}}" /></div>{{/prefs}}<a name="save" class="btn save">save</a></form>')
, fetch: function(){
    var self = this;
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
    this.$el.append($('<a/>',{text: 'prefs', 'class': 'prefs-button'}))
    this.getPrefs();
  }
, setDropTarget: function(){
    this.$el.droppable({drop: function(w){
      this.updateWidget($(w.toElement).data('widget'));
    }.bind(this)})
  }
, updateWidget: function(widget){
    this.model.prefs = [{fetch: null}]
    this.model.save(widget, {
      success: function(err, r){
        console.log('SUCCESS');
        location.reload();
      }, error: function(m,e,o){
        console.log('ERROR',m,e,o,m._id);
        location.reload();
      }});
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
    var prefs = this.prefs;
    delete( prefs['fetch'] )
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
