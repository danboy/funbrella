var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , messageSchema = new Schema({
      date: { type: Date, default: Date.now }
    , content: { type: String, unique: true }
  });

module.exports = mongoose.model('Message', messageSchema);
