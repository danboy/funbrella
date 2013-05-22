var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , widgetSchema = new Schema({
      date: { type: Date, default: Date.now }
    , _board: { type: Number, ref: 'Board' }
    , name: { type: String }
    , script: { type: String }
    , template: { type: String}
    , prefs: []
    , current_status: { type: Number, default: 0}
  });

module.exports = mongoose.model('Widget', widgetSchema);
