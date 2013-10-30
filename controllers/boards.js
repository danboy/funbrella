var Board   = require('../models/board.js')
  , mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , _ = require('underscore')
  , Widgets = require('../lib/widgets.js')
  , Widget = require('../models/widget.js');

module.exports = {
  index: function(req, res){
    res.render('index');
  }
, show: function(req, res){
    Board.findOne({name: req.params.id}).populate('widgets watchers').exec(function(err, board){
      res.render('boards/show',{board: board, error: err})
    });
  }
, edit: function(req, res){
    Board.findById(req.params.id).populate('widgets watchers').exec(function(err, board){
      Widgets.getAll(function(widgets){
        Widgets.getWatchers(function(watchers){
          res.render('boards/edit', {board: board, availableWidgets: _.map(widgets, function(w){return [w.name, w.name]}), availableWatchers: _.map(watchers, function(w){return [w.name, w.name]})});
        });
      })
    });
  }
, new: function(req, res){
    res.render('boards/new')
  }
, create: function(req, res){
    var board = new Board(req.body);
    board.save(function(err, board){
      res.redirect('/boards/'+board._id+'/edit')
    });
  }
}
