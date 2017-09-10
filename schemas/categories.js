/**
 * Created by bulusi on 2017/9/10.
 */


var mongoose = require('mongoose');
//分类的表结构

var userSchema = new mongoose.Schema({
    //分类名称
    name:String,

});
module.exports = userSchema;