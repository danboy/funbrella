var request = require('request')
  , parser = require('xml2json');

var Get = {
  fetch: function(req, res){
    request({
      url: req.body.url
    , headers: req.params.data
      },function(err,resp,body){
        if(req.body.xml == 'true'){
          res.send(parser.toJson(body,{arrayNotation: true, sanitize: false}));
        }else{
          res.send(body)
        }
    });
  }

};

module.exports = Get;
