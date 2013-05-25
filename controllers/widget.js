var Widget = require('../models/widget.js')

String.prototype.toCamel = function(){
    return this.replace(/(\_[a-z])/g, function($1){return $1.toUpperCase().replace('_','');});
};

module.exports = {
  create: function(req, res){
    widget = new Widget(templates[name]);
    widget.save(function(err,w){
      if(err){res.send(err)}
      res.send(w);
    })
  }
, update: function(req, res){
    var id = req.body._id;
    delete(req.body._id)
    Widget.update({_id: id },{$set: req.body}, function(err,w){
      console.log(err,w, req.body);
      if(err){res.send(err)}
      res.send(w);
    }) 
  }
}
