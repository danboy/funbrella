var request = require('request')
  , parser = require('xml2json');

var Get = {
  fetch: function(req, res){
    request({
      url: req.body.url
    , headers: req.params.data
      },function(err,resp,body){
        if(req.body.xml){
          res.send(parser.toJson(body));
        }else{
          res.send(body)
        }
    });
  }

};

module.exports = Get;
