var Funbrella = Funbrella || {};

Funbrella.espnnews = Funbrella.WidgetView.extend({
  prefs: {
    frequency: 20
  }
, template: Hogan.compile('{{#img}}<img src="{{img}}" />{{/img}}<h1>{{{headline}}}</h1><p>{{{description}}}</p>')
, setup: function(){
    this.url = "http://api.espn.com/v1/now/top?apikey=64dq8h6m5wdsjyn4p6fnnm7n"
  }
, data: function(data, cb){
    var article = this.random(data.feed);
    if(article.images.length > 0){
      article.img = article.images[0].url
    }
    cb(article);
  }
});
