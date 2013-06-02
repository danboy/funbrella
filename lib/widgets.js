var fs = require('fs')
  , phantomjs = require('phantomjs')
  , path = __dirname+'/../public/widgets';

String.prototype.toCamel = function(){
    return this.replace(/(\_[a-z])/g, function($1){return $1.toUpperCase().replace('_','');});
};

var Widgets = {
  Widgets: []
, get: function(board, cb){
    this.getEnabled(board, cb);
  }
, getEnabled: function(board, cb){
    w = [];
    board.widgets.forEach(function(widget, index){
      w.push({ name: widget.name, id: widget.name+index, prefs: [], params: widget.params });
    });
    cb(w);
  }
, getAvailable: function(cb){
    this.Widgets = [];
    this.Defaults = ['messageBoard', 'weather','ltrain','bus','semaphore'];
    var files = fs.readdirSync(path);
    files.forEach(function(file){
      this.Widgets[file.toCamel()] = { name: file, script: file.toCamel()};
    }.bind(this));
    cb(this.Widgets, this.Defaults);
  }
, getAll: function(cb){
    this.Widgets = [];
    var files = fs.readdirSync(path);
    files.forEach(function(file){
      //var png = phantomjs.capture('/widgets/find/'+file)
      this.Widgets.push({ name: file, script: file.toCamel()});
    }.bind(this));
    cb(this.Widgets);
  }
};

module.exports = Widgets;
