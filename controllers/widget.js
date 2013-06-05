var Widget = require('../models/widget.js')

String.prototype.toCamel = function(){
    return this.replace(/(\_[a-z])/g, function($1){return $1.toUpperCase().replace('_','');});
};

module.exports = {
  index: function(req, res){
    Widget.find({},function(err, widgets){
      res.format({
        html: function(){
          res.render('widget',  { values: { error: err
                                          , widgets: widgets
                                          }
                              , partials: { content: '{{>widgets/index}}' }});
        }
      , json: function(){
          res.send(widgets)
        }
      });
    });
  }
, show: function(req, res){
    Widget.findOne({_id: req.params.id.toString() },function(err, widget){
      res.format({
        html: function(){
          res.render('widget',  { values: { error: err
                                          , widget: widget
                                          , script: "var widget = new Funbrella."+widget.name+"({ model: "+ JSON.stringify(widget)+", el: '#widget' });"
                                          }
                              , partials: { content: '{{>widgets/show}}' }});
        }
      , json: function(){
          res.send({error: err, widget: widget})
        }
    });
    });
  }
, find: function(req, res){
    Widget.findOne({name: req.params.id.toString() },function(err, widget){
      res.format({
        html: function(){
          res.render('widget',  { values: { error: err
                                          , widget: widget
                                          , script: "var widget = new Funbrella."+widget.name+"({ model: "+ JSON.stringify(widget)+", el: '#widget' });"
                                          }
                              , partials: { content: '{{>widgets/show}}' }});
        }
      , json: function(){
          res.send({error: err, widget: widget})
        }
    });
    });
  }
, create: function(req, res){
    widget = new Widget(templates[name]);
    widget.save(function(err,w){
      if(err){res.send(err)}
      res.send(w);
    })
  }
, update: function(req, res){
    var id = req.body._id;
    delete(req.body._id)
    Widget.update({_id: id },{$unset: {prefs: 1}}, function(err,wi){
      Widget.update({_id: id },{$set: req.body}, function(er,w){
        if(er){res.send(er)}
        res.send(w);
      })
    })
  }
}
