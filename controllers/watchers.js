var Widget = require('../models/widget.js')
  , Board  = require('../models/board.js')
  , _ = require('underscore')
  , Widgets = require('../lib/widgets.js');

String.prototype.toCamel = function(){
    return this.replace(/(\_[a-z])/g, function($1){return $1.toUpperCase().replace('_','');});
};

module.exports = {
  create: function(req, res){
    widget = new Widget(req.body);
    widget.save(function(err,w){
      if(err){res.send(err)}
      Board.update({_id: w.board},{$addToSet: {watchers: w}}, function(er, board){
        res.redirect('/boards/'+w.board+'/edit');
      });
    })
  }
}
