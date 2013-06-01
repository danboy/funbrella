Funbrella.Watch = Funbrella.Watch || {};
Funbrella.Watch.News = Funbrella.Watcher.extend({
  options: {
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
, buildUrl: function(){
    if(this.options.randomize){
      this.options.category = this.random(this.options.categories);
    }
    switch(this.options.type){
      case 'search':
        this.url = 'http://api.feedzilla.com/v1/categories/'+this.options.category+'/articles/search.json?count='+this.options.count+'&q='+this.options.query
        break;
      default:
        this.url = 'http://api.feedzilla.com/v1/categories/'+this.options.category+'/articles.json?count='+this.options.count
        break;
    }
  }
});
