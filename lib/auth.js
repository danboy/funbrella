var User  = require('../models/user.js')
  , config = require('../config/auth.js')
  , getUser = function(promise,data,column,auth){
        if(auth){
          User.findOne({'_id': auth.userId},function(err,user){
            user[column] = data.id;
            if(!user.email){user.email = data.email}
            user.save();
            return promise.fulfill(user);
          })
          return true;
        };
        var query = {};
        query[column] = data.id;
        User.findOne(query,function(err,u){
          if(err) throw err;
          if(!u){
            user = new User({name: data.name, email: data.email});
            user[column] = data.id;
            user.save(function(err,user){
              if(err) throw err;
            });
          }else{
            user = u; 
          };
          return promise.fulfill(user);
        });
  }



module.exports = {
  init: function(everyauth,app){
    everyauth.everymodule.findUserById( function (userId, callback) {
      User.findOne({_id: userId}, function(err,foundUser){
        callback(err,foundUser);
      });
    });
    everyauth.github
      .appId(config.github.appId)
      .appSecret(config.github.appSecret)
      .findOrCreateUser( function (session, accessToken, accessTokenExtra, gData) {
        var user
          , promise = this.Promise();
        if(gData.id === '8413'){
        getUser(promise, gData, 'githubId',session.auth);
        return promise;
        }else{ 
          return false;
        }
      })
      .redirectPath('/');
  }
}
