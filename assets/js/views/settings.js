var Funbrella = Funbrella || {};

Funbrella.SettingsView = Backbone.View.extend({
  initialize: function(options){
    this.model = new Funbrella.Widget(options.model)
    this.prefs = $.extend( this.prefs, options.model.prefs);
    this.$el.addClass(this.model.get('type'))
    if(this.hasRequiredPrefs()){
      this.setup();
      this.start();
    }else{
      this.configure();
    }
  }
, events: {
  'click .prefs-submit': 'updatePrefs'
}
, prefs: {
    frequency: 60
  }
, help: {
    title: 'I need some settings'
  , description: 'I need some settings to work, check the documentation for'
  , link: {url: 'http://github.com/danboy/funbrella', text: 'more info'}
  }
, config: {
    xml: false
  , fetch: true
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
, configure: function(){
    this.$el.html(this.prefsTemplate({prefs: this.getPrefs(), _csrf: window._csrf, model: this.model.toJSON(), help: this.help}))
  }
, typeofPref: {
    object: function(input){
      return input.val().split(',');
    }
  , boolean: function(input){
      return (input.val() == "true") ? true : false;
    }
  , string: function(input){
      return input.val();
    }
  , number: function(input){
      return parseInt(input.val());
    }
  }
, prefsTemplate: prefs
, random: function(array){
    position = Math.floor((Math.random()*array.length));
    return array[position];
  }
, updatePrefs: function(e){
    e.stopPropagation();
    e.preventDefault();
    this.$el.find('input.pref').each(function(index,input){
      var input = $(input);
      this.prefs[$(input).attr('name')] = this.typeofPref[input.data('type')](input);
    }.bind(this));
    var prefs = this.prefs;
    var widgetId = this.$el.find('input[name=_id]')[0].value;
    var self = this;
    console.log(widgetId);
    $.ajax({
      type: 'POST'
    , url: '/widgets/update-prefs'
    , data: {
        _csrf: _csrf
      , prefs: prefs
      , _id: widgetId
      }
    , success: function(e,r){
        console.log('success',e,r); 
        document.location.reload();
      }
    });
  }
, getPrefs: function(){
    var prefs = [];
    for( var pref in this.prefs ){
      prefs.push({ name: pref, value: this.prefs[pref] , type: typeof(this.prefs[pref])});
    }
    return prefs;
  }
});
