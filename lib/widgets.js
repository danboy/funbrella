var fs = require('fs')
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
      var prefs = require(path+'/'+file+'/prefs.js');
      this.Widgets[file.toCamel()] = { name: file, script: file.toCamel(), prefs: prefs.prefs };
    }.bind(this));
    cb(this.Widgets, this.Defaults);
  }
};

module.exports = Widgets;
