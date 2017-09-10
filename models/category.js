/**
 * Created by bulusi on 2017/9/10.
 */

var mongoose = require('mongoose');

var categorySchema = require('../schemas/categories.js');

var categoryModel = mongoose.model('Category',categorySchema);

module.exports = categoryModel;