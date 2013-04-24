var Message   = require('../models/message.js');

module.exports = {

  index: function(req, res){
    Message.find(function(err, messages){
      res.format({
        html: function(){
          res.render('layout',{values:{messages: messages},partials: { content: '{{>messages/index}}'} });
        }
      , json: function(){
          res.send( { messages: messages } );
        }
      });
    });
  }
, new: function(req, res){
    res.render('layout',{ partials: { content: '{{>messages/form}}'} })
  }
, create: function(req, res){
    var message = { content: req.body.content }
    var message = new Message(message);
    message.save(function(err,b){
      res.send(b);
    });
  }
}
