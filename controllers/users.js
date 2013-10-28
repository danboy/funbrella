var User = require('../models/user.js')
var Users = {
  show: function(req, res){
    User.findById(req.params.id, function(err, user){
      res.send(user);
    });
  }
}
module.exports = Users;
