Funbrella.Watch = Funbrella.Watch || {};
Funbrella.Watch.nytimes = Funbrella.Watcher.extend({
  options: {
      category: 25
    , categories: [36, 25, 10, 16, 8, 31, 13, 22, 1168, 11, 14, 28, 20, 29, 34, 30, 26, 19]
    , type: 0
    , query: 'design'
    , count: 10
    , frequency: 300
    , randomize: true
  }
, prefs: {
  key: ''
}
, setup: function(){
  this.url = "http://api.nytimes.com/svc/mostpopular/v2/mostviewed/all-sections/1.json?api-key="+this.prefs.key;
}
, template: Hogan.compile('<div class="news-snippet"><h2>{{title}}</h2><p>{{summary}}</p></div>')
, random: function(array){
    position = Math.floor((Math.random()*array.length));
    return array[position];
  }
, data: function(data, cb){
  this.buildUrl();
  var article = this.random(data.articles);
  var message = {type: 'news', content: this.template.render(article)};
  cb(message)
}
});
