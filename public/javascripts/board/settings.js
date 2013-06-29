Funbrella.SettingsView = Backbone.View.extend({
  initialize: function(options){
    this.board = JSON.parse(options.board);
    this.model = new Funbrella.Widget(options.model)
    this.collection = new Funbrella.Widgets(options.collection);
    window.settings = this;
  }
, template: JST['watchers']
, render: function(data){
    var template = this.template.render(data)
    this.$el.append(template)
    $('#watchers').toggleClass('watcher-show')
  }
});
