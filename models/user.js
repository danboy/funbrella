var mongoose = require('mongoose')
  , NestedSetPlugin = require('mongoose-nested-set')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , userSchema = new Schema({
      date: {type: Date, default: Date.now}
    , name: {type: String}
    , email: String
    , googleId: String
    , githubId: String
    , salted_pass: String
  });

userSchema.plugin(NestedSetPlugin);
module.exports = mongoose.model('User', userSchema);
