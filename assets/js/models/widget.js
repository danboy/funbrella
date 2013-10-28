var Funbrella = Funbrella || {};

Funbrella.Widget = Backbone.Model.extend({ url: '/widgets'});

Funbrella.Widgets = Backbone.Collection.extend({
    model:  Funbrella.Widget
});
