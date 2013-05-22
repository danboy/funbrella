var Template = require('../models/template.js')
  , fs = require('fs')
  , path = __dirname+'/../public/widgets';

String.prototype.toCamel = function(){
    return this.replace(/(\_[a-z])/g, function($1){return $1.toUpperCase().replace('_','');});
};

module.exports = {
  generate: function(req, res){
    var files = fs.readdirSync(path);
    files.forEach(function(file){
      var prefs = require(path+'/'+file+'/prefs.js');
      Template.update({name: file}, {$set: { name: file.toCamel(), prefs: prefs.prefs }}, {upsert: true}, function(err, w ){
        console.log(prefs.prefs, err, w);
      });
    }.bind(this));

    Template.find(function(err, widgets){
      res.render('layout',{values:{widgets: widgets},partials: { content: '{{>widgets/generate}}'} })
    });

  }
}
