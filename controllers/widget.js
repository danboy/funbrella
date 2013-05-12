var Widget = require('../models/widget.js')
  , fs = require('fs')
  , path = __dirname+'/../public/widgets';

module.exports = {
  generate: function(req, res){
    var files = fs.readdirSync(path);
    files.forEach(function(file){
      var prefs = require(path+'/bus/prefs.js');
      Widget.update({name: file}, {$set: { name: file, prefs: prefs.prefs }}, {upsert: true}, function(err, w ){
        console.log(prefs.prefs, err, w);
      });
    }.bind(this));

    Widget.find(function(err, widgets){
      res.render('layout',{values:{widgets: widgets},partials: { content: '{{>widgets/generate}}'} })
    });

  }
}
