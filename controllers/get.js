var request = require('request');

var Get = {
  fetch: function(req, res){
    request({
      url: req.body.url
    , headers: req.params.data
      },function(err,resp,body){
        res.send(body);
    });
  }

};

module.exports = Get;
