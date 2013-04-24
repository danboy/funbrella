var Funbrella = Funbrella || {};
Funbrella.Widget = Backbone.Model.extend({
});

Funbrella.Widgets = Backbone.Collection.extend({
    model:  Funbrella.Widget
});


Funbrella.Widget = Backbone.View.extend({
  fetch: function(){
    var self = this;
    $.ajax({  url: this.url
            , dataType: "jsonp"
            , success: function(data){
              data.daily.data = data.daily.data.splice(0,4);
              self.render(data)
            }
    });
  }
, render: function(data){
    console.log(this.$el);
    this.prefs = $('#widget-prefs-'+this.model.id);
    this.prefs.find('input').each(function(index, input){
      $(input).val(this.options[$(input).attr('name')]);
    }.bind(this));
    this.$el.html(this.template.render(data)).append(this.prefs);
  }
, showPrefs: function(e){
    this.prefs.toggle();
  }
});
