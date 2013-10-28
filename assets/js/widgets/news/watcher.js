Funbrella.Watch = Funbrella.Watch || {};
Funbrella.Watch.news = Funbrella.Watcher.extend({
  prefs: {
      category: 25
    , categories: [36, 25, 10, 16, 8, 31, 13, 22, 1168, 11, 14, 28, 20, 29, 34, 30, 26, 19]
    , type: 0
    , query: 'design'
    , count: 10
    , frequency: 300
    , randomize: true
  }
, setup: function(){
  this.buildUrl();
}
, template: newsWatcher
, data: function(data, cb){
  this.buildUrl();
  var article = this.random(data.articles);
  var message = {type: 'news', content: this.template(article)};
  cb(message)
}
, buildUrl: function(){
    if(this.prefs.randomize){
      this.prefs.category = this.random(this.prefs.categories);
    }
    switch(this.prefs.type){
      case 'search':
        this.url = 'http://api.feedzilla.com/v1/categories/'+this.prefs.category+'/articles/search.json?count='+this.prefs.count+'&q='+this.prefs.query
        break;
      default:
        this.url = 'http://api.feedzilla.com/v1/categories/'+this.prefs.category+'/articles.json?count='+this.prefs.count
        break;
    }
  }
});
