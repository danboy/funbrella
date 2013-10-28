var Board = require('../models/board.js');
var Home = {
  index: function(req, res){
    console.log('user:', req.user);
    if(req.user){
      Board.find({owner: req.user._id}, function(err, boards){
        res.render('welcome', {boards: boards});
      });
    }else{
      res.render('index', { title: 'Express' });
    }
  }
}
module.exports = Home;
