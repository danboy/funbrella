
  var fs = require('fs')
  , path = __dirname+'/../controllers/'
  , files = fs.readdirSync(path)
  , Controllers = {};

  files.forEach(function(controller){
    if (controller === "index.js" || controller.substr(controller.lastIndexOf('.') + 1) !== 'js')
      return;
    var name = controller.charAt(0).toUpperCase()+controller.replace('.js', '').slice(1);
    var c = require(path+controller);
    Controllers[name] = c;
  });



module.exports = Controllers;
