var Board   = require('../models/board.js')
  , Widgets = require('../lib/widgets.js');


module.exports = {

  index: function(req, res){
    Board.find(function(err, boards){
      res.render('layout',{values:{boards: boards},partials: { content: '{{>index}}'} });
    });
  }

, show: function(req, res){
    Board.findOne({name: req.params.id.toString() }, function(err, board){
      Widgets.get(board, function(widgets){
        res.format({
          html: function(){
            res.render('layout',  { values: { socket: req.params.id
                                            , error: err
                                            , board: board
                                            , script: "var board = new Funbrella.BoardView({ board: '"+ board.name + "', el: '#board' });"
                                            , widgets: widgets }
                                , partials: { content: '{{>boards/show}}' }});
          }
        , json: function(){
            res.send(widgets)
          }
        });
      });
    });
  }
, new: function(req, res){
    Widget.find(function(err, widgets){
      if(err){ throw err;}
      res.render('layout',{values:{widgets: widgets},partials: { content: '{{>boards/form}}'} })
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
}
