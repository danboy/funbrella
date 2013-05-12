var Board   = require('../models/board.js')
  , Widget = require('../models/widget.js');


module.exports = {

  index: function(req, res){
    Board.find(function(err, boards){
      res.render('layout',{values:{boards: boards},partials: { content: '{{>index}}'} });
    });
  }

, show: function(req, res){
    Board.findOne({name: req.params.id.toString() }).populate('widgets').exec( function(err, board){
      console.log(board);
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
    Widget.find(function(err, widgets){
      res.render('layout',{values:{widgets: widgets},partials: { content: '{{>boards/form}}'} })
    })
  }
, create: function(req, res){
    console.log('BOARD', req.body)
    var board = new Board(req.body);
    board.save(function(err,b){
      console.log(err, b);
      res.send(b);
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
