Funbrella
=========

A fun flexible info aggregator in node/express

There are widgets and watcher, a board has four widgets for contant display of information and a left side "watcher" panel that's contantly updated.

```
npm install
set up your DB in config/app.js
set up some api keys in config/auth.js.
```

Launch and add a board.

Right now set up is pretty manual and you need to add API keys for most widgets.

Creating a widget
=================

Widgets are stored in assets/js/widgets
Widgets are initialized off of manifest.coffee and use the Funbrella.WidgetView class.

widgetname/
|-manifest.coffee

Require your scripts and templates in manifest.

``` coffee
#= require ./widgetname.jade
#= require ./script.js
```

Build your script

``` js
Funbrella.mywidget = Funbrella.WidgetView.extend({
  prefs: {
    key: ''
  }
, requires: ['key'] //array of required prefs. Funbrella will launch a config if one is blank
, template: widgetname
, setup: function(){
    //declare your url to fetch here with this.url
    this.url = 'http://awesomeapi.com/get/stuff?key='+this.prefs.key
  }
, data: function(data, cb){
    //this is where you manipulate the data returned from the API. pass it to callback when you're done.
    cb(data);
  }
});
```





