/**
 * Created by bulusi on 2017/8/20.
 */

var mongoose = require('mongoose');
//用户的表结构

var userSchema = new mongoose.Schema({
    username:String,
    password: String,
    isAdmin: {
        type:Boolean,
        default: false
    },
});
module.exports = userSchema;