var Funbrella = Funbrella || {};

Funbrella.news = Funbrella.Widget.extend({
  template: Hogan.compile('<h2>{{title}}</h2><p>{{summary}}</p>')
, initialize: function(options){
    this.model = options.model
    this.options = $.extend( {
      category: 25
    , categories: [36, 25, 10, 16, 8, 31]
    , type: 0
    , query: 'design'
    , count: 10
    , frequency: 30
    , randomize: true
    }, this.model.params);
    this.fetch();
    setInterval(function(){this.fetch();}.bind(this), this.options.frequency*1000);
  }
, fetch: function(url){
    self = this;
    this.buildUrl();
    $.ajax({  url: this.url
            , dataType: "jsonp"
            , success: function(data){
              self.render(self.choose(data.articles));
            }
    });
  }
, random: function(array){
    position = Math.floor((Math.random()*array.length));
    return array[position];
  }
, choose: function(articles){
    return articles[Math.floor((Math.random()*articles.length))];
  }
, render: function(article){
    $('#'+this.model.id).html(this.template.render(article))
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
