var Funbrella = Funbrella || {};

Funbrella.imgur = Funbrella.WidgetView.extend({
  prefs: {
    frequency: 60
  , showNsfw: false

  },
  template: Hogan.compile('<div class="imgur"><h1>{{title}}</h1><img src="http://i.imgur.com/{{hash}}{{ext}}" class="{{scale}}" /></div>')
, setup: function(){
    this.url = "http://imgur.com/gallery/top/all.json"
  }
, data: function(data, cb){
    var img = this.random(data.data);
    img.scale = (img.width/img.height)? 'wide' : 'tall';
    if(img.nsfw && !this.prefs.showNsfw){
      this.data(data)
    }else{
      cb(img);
    }
  }
});
