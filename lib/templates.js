var fs = require('fs')
  , walk = require('walk')
  , path = __dirname+'/../public/widgets/'
  , files = fs.readdirSync(path)
  , Templates = [];
options = {
      followLinks: false,
          filters: ["css", "*~",".*"]
          };
var walker = walk.walk(path,options)

walker.on("file", function(root, stats, next){
  var mustache = /(\.(mustache|hjs))$/
  if(stats.name.match(mustache)){
    Templates.push(root+stats.name)
  }
  next();
});

module.exports = Templates;
