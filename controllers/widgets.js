var Widget = require('../models/widget.js')
  , Board  = require('../models/board.js')
  , _ = require('underscore')
  , Widgets = require('../lib/widgets.js');
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
, edit: function(req, res){
    Widget.findById(req.params.id, function(err, widget){
      console.log(widget.prefs[0]);
      Widgets.getAvailable(function(widgets){
       res.render('widgets/edit', {widget: widget, availableWidgets: _.map(widgets, function(w){return [w.name, w.name]})})
      })
    });
  }
, create: function(req, res){
    widget = new Widget(req.body);
    widget.save(function(err,w){
      if(err){res.send(err)}
      Board.update({_id: w.board},{$addToSet: {widgets: w}}, function(er, board){
        res.redirect('/boards/'+w.board+'/edit');
      });
    })
  }
, update: function(req, res){
    req.body.prefs = [];
    Widget.update({_id: req.params.id }, {$set: req.body}, {upsert: true}, function(err,wi){
      if(err){res.send(err)}
      res.redirect('/');
    })
  }
, prefs: function(req, res){
    console.log(typeof(req.body.prefs.urls), req.body.prefs.urls);
    if(req.body.prefs.urls && typeof(req.body.prefs.urls) == 'string'){
      req.body.prefs.urls = req.body.prefs.urls.split(',');
    }
    delete(req.body.prefs.status);
    Widget.update({_id: req.body._id }, {$set: {prefs: req.body.prefs}}, function(err,wi){
      if(err){res.send(err)}
      res.redirect('/boards/One');
    })
  }
}
