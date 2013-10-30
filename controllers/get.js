var request = require('request')
  , parser = require('xml2json');

var Get = {
  fetch: function(req, res){
    request({
      url: req.body.url
    , headers: req.body.headers
      },function(err,resp,body){
        if(req.body.xml == 'true'){
          res.send(parser.toJson(body,{arrayNotation: true, sanitize: false}));
        }else{
          res.send(body)
        }
    });
  }
, ping: function(req, res){
    request({
      url: req.body.url
      },function(err,resp,body){
        if(!err && req.statusCode === 200){
          res.send(200,{site: req.body.site, status: 'ok'})
        }else{
          res.send(200,{site: req.body.site, status: 'error'})
        }
    });
  }

};

module.exports = Get;
