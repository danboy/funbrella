var fs = require('fs')
  , path = __dirname+'/../public/javascripts/board/templates/'
  , files = fs.readdirSync(path)
  , Templates = [];

HoganTemplates = function(req,res){
  console.log(Templates);
  res.send(Templates)
};

files.forEach(function(item){
  name = item.replace('.hjs','')
  console.log(item, item.indexOf(/hjs$/))
  if(item.match(/hjs$/))
    fs.readFile(path+item,'utf8', function(file){
      Templates[name] = file;
    });
});



