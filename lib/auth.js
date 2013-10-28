var User  = require('../models/user.js')
  , config = require('../config/auth.js');

function findUserByOauthId(oauthid, cb){
  User.findOne(oauthid, cb);
}

module.exports = {
  init: function(everyauth,app){
    everyauth.everymodule
      .findUserById( function (userId, cb) {
        User.findById(userId).populate('boards').exec(function(err, user){
          cb(err,user);
        });
      })
      .userPkey('_id');

    everyauth.github
      .appId(config.github.appId)
      .appSecret(config.github.appSecret)
      .findOrCreateUser( function (session, accessToken, accessTokenExtra, gData) {
        var promise = this.Promise();
        findUserByOauthId({'githubId': gData.id}, function(err,data){
          if(data){
            promise.fulfill(data);
          }else{
            user = new User({name: gData.name, email: gData.email, githubId: gData.id});
            user.save(function(err,user){
              if(err) throw err;
              promise.fulfill(user);
            });
          }
        });
        return promise;
      })
      .redirectPath('/');
    everyauth.google
      .appId(config.google.appId)
      .appSecret(config.google.appSecret)
      .scope('https://www.google.com/m8/feeds','https://www.googleapis.com/auth/drive')
      .findOrCreateUser( function (session, accessToken, accessTokenExtra, gData) {
        var promise = this.Promise();
        findUserByOauthId({'googleId': gData.id}, function(err,data){
          //TODO: make this re usable
          if(data){
            promise.fulfill(data);
          }else{
            user = new User({name: gData.name, email: gData.email, githubId: gData.id});
            user.save(function(err,user){
              if(err) throw err;
              promise.fulfill(user);
            });
          }
        });
        return promise;
      })
      .redirectPath('/');
  }
}
