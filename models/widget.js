var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , widgetSchema = new Schema({
      date: { type: Date, default: Date.now }
    , name: { type: String, unique: true }
    , script: { type: String }
    , template: { type: String}
    , params: { type: Schema.Types.ObjectId, ref: 'Param' }
    , current_status: { type: Number, default: 0}
  });

module.exports = mongoose.model('Widget', widgetSchema);
