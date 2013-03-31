var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , paramSchema = new Schema({
      date: { type: Date, default: Date.now}
    , name: { type: String, unique: true }
    , data: { type: String }
  });

module.exports = mongoose.model('Param', paramSchema);
