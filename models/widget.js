var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , widgetSchema = new Schema({
      date: { type: Date, default: Date.now }
    , board: { type: Schema.Types.ObjectId, ref: 'Board' }
    , type: { type: String }
    , script: { type: String }
    , template: { type: String}
    , prefs: {}
    , current_status: { type: Number, default: 0}
  });

module.exports = mongoose.model('Widget', widgetSchema);
