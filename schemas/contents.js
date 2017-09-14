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
        ref:'Category'
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
    },
    //关联字段 - 用户id
    user: {
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref:'User'
    },
    //添加时间
    addTime:{
        type:Date,
        default: new Date()
    },
    //阅读量
    views:{
        type:Number,
        default:0
    },
    //评论
    comments:{
        type:Array,
        dafault:[]
    }

});
module.exports = contentSchema;