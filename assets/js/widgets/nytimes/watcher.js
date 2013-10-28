Funbrella.Watch = Funbrella.Watch || {};
Funbrella.Watch.nytimes = Funbrella.Watcher.extend({
  prefs: {
  frequency: 300
, key: ''
  }
, help: {
    title: 'I need some settings'
  , description: 'I need a new youk times api key in order to get your articles.'
  , link: {url: 'http://developer.nytimes.com/', text: 'nytimes developer portal'}
  }
, requires: ['key']
, setup: function(){
  this.url = "http://api.nytimes.com/svc/mostpopular/v2/mostviewed/all-sections/1.json?api-key="+this.prefs.key;
}
, template: nytimesMessage
, random: function(array){
    position = Math.floor((Math.random()*array.length));
    return array[position];
  }
, data: function(data, cb){
  var article = this.random(data.results);
  if(article.media[0]){
    var images = article.media[0]['media-metadata'] || [];
    article.image = (images[3]) ? images[3].url : images[0].url;
  }
  var message = {type: 'nytimes', content: this.template(article)};
  cb(message)
}
});
