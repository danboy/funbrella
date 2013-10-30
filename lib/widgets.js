var fs = require('fs')
  , path = __dirname+'/../assets/js/widgets';

String.prototype.toCamel = function(){
  return this.replace(/(\_[a-z])/g, function($1){return $1.toUpperCase().replace('_','');});
};

var Widgets = {
  Widgets: []
, getAvailable: function(cb){
    this.Widgets = [];
    var files = fs.readdirSync(path);
    files.forEach(function(file){
      this.Widgets.push( { name: file, script: file.toCamel()} );
    }.bind(this));
    cb(this.Widgets);
  }
, getAll: function(cb){
    Widgets.getAvailable(function(widgets){
    var Widgets = [];
      widgets.forEach(function(widget,index){
        fs.stat(path+'/'+widget.name+'/manifest.coffee',function(err, data){
          if(data){
            Widgets.push({ name: widget.name, script: widget.script });
          };
          if((index+1) === widgets.length){
            cb(Widgets)
          }
        });
      });
    });
  }
, getWatchers: function(cb){
    var Watchers = [];
    Widgets.getAvailable(function(widgets){
      widgets.forEach(function(widget,index){
        fs.stat(path+'/'+widget.name+'/watch.coffee',function(err, data){
          if(data){
            Watchers.push({name: widget.name});
          };
          if((index+1) === widgets.length){
            cb(Watchers)
          }
        });
      });
    });
  }
};

module.exports = Widgets;
