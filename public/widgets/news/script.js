var Funbrella = Funbrella || {};
Funbrella['news'] = function(container, options){
  setTimeout(function(){
    this.container = $(container);
    this.options = $.extend( {
      category: 25
    , categories: [36, 25, 10, 16, 8, 31]
    , type: 0
    , query: 'design'
    , count: 10
    , frequency: 30
    , randomize: true
    }, options);
    timer = this.options.frequency*1000;
    this.fetch();
    setInterval(function(){this.fetch();}.bind(this), timer);
  }.bind(this), 2000);
};

Funbrella.news.prototype ={
  fetch: function(){
    this.buildUrl();
    var self = this;
    $.ajax({  url: this.url
            , dataType: "jsonp"
            , success: function(data){
              self.render(self.choose(data.articles));
            }
    });
  },
  random: function(array){
    position = Math.floor((Math.random()*array.length));
    return array[position];
  }
, choose: function(articles){
    return articles[Math.floor((Math.random()*articles.length))];
  }
, render: function(article){
    var snippet = $('<article />',{'class': 'news'});
    var headline = $('<h2/>',{text: article.title});
    var text = $('<p/>',{text: article.summary});
    snippet.append(headline).append(text);
    $(this.container).html(snippet);
    return article;
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
}

