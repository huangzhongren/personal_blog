/**
 * Created by bulusi on 2017/9/12.
 */
var mongoose = require('mongoose');

var contentSchema = require('../schemas/contents.js');

var contentModel = mongoose.model('Content',contentSchema);

module.exports = contentModel;