/**
 * Created by bulusi on 2017/9/12.
 */


var mongoose = require('mongoose');
//内容的表结构

var contentSchema = new mongoose.Schema({
    //内容标题
    title:String,
    //关联字段 - 内容分类的id
    category: {
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref:'Content'
    },
    //内容简介
    description: {
        type:String,
        default:''
    },
    //内容
    content: {
        type:String,
        default:''
    }

});
module.exports = contentSchema;