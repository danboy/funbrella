var mongoose = require('mongoose')
  , WidgetSchema = require('../models/widget.js')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , boardSchema = new Schema({
      date: {type: Date, default: Date.now}
    , name: {type: String, unique: true }
    , owner: { type: Schema.Types.ObjectId, ref: 'User' }
    , widgets: [{ type: Schema.Types.ObjectId, ref: 'Widget' }]
    , watchers: [{ type: Schema.Types.ObjectId, ref: 'Widget' }]
    , current_status: { type: Number, default: 0}
  });

module.exports = mongoose.model('Board', boardSchema);
