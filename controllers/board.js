var Board   = require('../models/board.js')
  , mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , Widget = require('../models/widget.js')
  , WidgetTemplates = require('../lib/widgets.js');

module.exports = {

  index: function(req, res){
    Board.find(function(err, boards){
      res.render('layout',{values:{boards: boards},partials: { content: '{{>index}}'} });
    });
  }

, show: function(req, res){
    Board.findOne({name: req.params.id.toString() }).populate('widgets').exec( function(err, board){
      if(!board){
        res.redirect('/')
        return
      }
        res.format({
          html: function(){
            res.render('layout',  { values: { error: err
                                            , board: board
                                            , script: "var board = new Funbrella.BoardView({ board: '"+ board.name + "', el: '#board' });"
                                            }
                                , partials: { content: '{{>boards/show}}' }});
          }
        , json: function(){
            res.send(board)
          }
      });
    });
  }
, new: function(req, res){
    res.render('layout',{partials: { content: '{{>boards/form}}'} })
  }
, create: function(req, res){
    WidgetTemplates.getAvailable(function(templates, defaults){
      var createBoard = function(w){
        board = new Board({ name: req.body.name, widgets: w })
        board.save(function(err, board){
          res.send({ board: board, errors: err });
        });
      }
      var widgets = [];
      defaults.forEach(function(name){
        widget = new Widget(templates[name]);
        widget.save(function(err,w){
          widgets.push(w.id);
          if(widgets.length == defaults.length){
            createBoard(widgets);
          }
        });
      });
    });
  }
, message: function(req, res){
    Board.find(function(err, boards){
      res.render('layout',{values:{sockets: boards},partials: { content: '{{>boards/message}}'} });
    });
  }
, send: function(req, res){
    if(req.body.html){
      app.socketServers[req.body.socket].emit(req.body.socket, JSON.stringify({html: req.body.html}));
    }
    res.send(JSON.stringify(req.body)+'\n');
  }
, static: function(req, res){
    res.render('layout',{ partials: { content: '{{>boards/static}}'} });
  }
}
