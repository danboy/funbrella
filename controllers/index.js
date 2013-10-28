bar Board = require('../models/board.js');
var Home = {
  index: function(req, res){
    if(req.user){
      res.render('index', { title: 'Express' });
    }else{
      res.send('welcome')
    }
  }
}
module.exports = Home;
