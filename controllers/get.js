var request = require('request')
  , parser = require('xml2json');

var Get = {
  fetch: function(req, res){
    request({
      url: req.body.url
    , headers: req.body.headers
      },function(err,resp,body){
        console.log('XML', req.body.xml, typeof(req.body.xml))
        if(req.body.xml == 'true'){
          res.send(parser.toJson(body,{arrayNotation: true, sanitize: false}));
        }else{
          res.send(body)
        }
    });
  }

};

module.exports = Get;
