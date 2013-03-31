var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , boardSchema = new Schema({
      date: {type: Date, default: Date.now}
    , name: {type: String, unique: true }
    , widgets: []
    , current_status: { type: Number, default: 0}
  });

module.exports = mongoose.model('Board', boardSchema);
