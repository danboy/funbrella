var fs = require('fs')
  , path = __dirname+'/../public/widgets';

var Widgets = {
  Widgets: []
, get: function(board, cb){
    this.getEnabled(board, cb);
  }
, getEnabled: function(board, cb){
    w = [];
    board.widgets.forEach(function(widget, index){
      w.push({ name: widget.name, id: widget.name+index, params: widget.params });
    });
    cb(w);
  }
, getAvailable: function(cb){
    this.Widgets = [];
    var files = fs.readdirSync(path);
    files.forEach(function(file){
      var prefs = require(path+'/bus/prefs.js');
      this.Widgets.push( { name: file, prefs: prefs.prefs } )
    }.bind(this));
    cb(this.Widgets);
  }
};

module.exports = Widgets;
