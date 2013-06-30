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
    Board.findOne({name: req.params.id.toString() }).populate('widgets').populate('watchers').exec( function(err, board){
      if(!board){
        res.redirect('/')
        return
      }
        WidgetTemplates.getAll(function(widgets, watchers){
          res.format({
            html: function(){
              var boardView = "var board = new Funbrella.BoardView({ board: '"+ board.name + "', el: '#board' });";
              var settingsView = "var settings = new Funbrella.SettingsView({watchers: "+JSON.stringify(watchers)+", widgets: "+ JSON.stringify(widgets)+", collection: "+JSON.stringify(board)+", el: '#settings', board: '"+JSON.stringify(board)+"'})";
              res.render('layout',  { values: { error: err
                                              , board: board
                                              , templates: nap.jst('templates')
                                              , scripts: nap.js('scripts')
                                              , allWidgets: widgets
                                              , allWatchers: watchers
                                              , script: boardView+settingsView
                                              }
                                  , partials: { content: '{{>boards/show}}' }});
            }
          , json: function(){
              res.send(board)
            }
        });
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
          res.redirect('/boards/'+ board.name)
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
, update: function(req, res){
    var id = req.body._id;
    delete(req.body._id)
    Board.update({_id: id },{$unset: {watchers: 1, widgets: 1}}, function(err,wi){
      Board.update({_id: id },{$set: req.body}, function(er,w){
        if(er){res.send(500, {errors: er})}
        res.send(w);
      })
    })
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
