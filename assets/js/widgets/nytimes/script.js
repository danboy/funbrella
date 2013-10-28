var Funbrella = Funbrella || {};

Funbrella.nytimes = Funbrella.WidgetView.extend({
  prefs: {
    frequency: 20
  , key: ''
  }
, requires: ['key']
, template: nytimes
, setup: function(){
    this.url = "http://api.nytimes.com/svc/mostpopular/v2/mostviewed/all-sections/1.json?api-key="+this.prefs.key;
  }
, data: function(data, cb){
    var article = this.random(data.results);
    if(article.media[0]){
      var images = article.media[0]['media-metadata'] || [];
      article.image = (images[3]) ? images[3].url : images[0].url;
    }
    cb(article);
  }
});
