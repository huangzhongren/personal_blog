/**
 * Created by bulusi on 2017/8/20.
 */


var router = require('express').Router();
var Category = require('../models/category');
var Content = require('../models/contents');

var _ = require('lodash')
/*处理通用数据
* */
var data = {}
router.use(function(req,res,next){
    data = {
        user: req.session.user,
        categories:[]
    }
    //读取所有的分类信息
    Category.find().then(function(results){
        data.categories = results;
        next();
    })
})
/*
* 首页
* 需要展示内容：
* 导航分类信息|文章内容信息|文章内容分页
* */
router.get('/',function(req,res,next){

    data = _.assign(data,{
        limit: 4,
        pages: 0,
        page: req.query.page||'',
        count:0,
        contents:[],
        category:req.query.category||''
    })
    var where = {};
    if(data.category){
        where.category = data.category
    }
    Content.where(where).count().then(function(count){
        data.count = count;
        data.pages = Math.ceil(data.count/data.limit);
        data.page = Math.min(data.pages,data.page);
        data.page = Math.max(data.page,1);
        var skip = (data.page-1)*data.limit;
        return Content.where(where).find().limit(data.limit).skip(skip).populate(['category','user']).sort({
            addTime:-1
        })
    }).then(function(contents){
        data.contents = contents;
        res.render('main/index',data)
    })
})
/*
* 文章详情页
* */
router.use('/view',function(req,res,next){
    var content_id = req.query.content_id;
    Content.findOne({
        _id:content_id
    }).populate(['user','category']).then(function(content){
        data.content = content;
        if(req.url.split('?')[0]=='/'){
            content.views++;
            content.save();
        }
        next();
    })
})
router.get('/view',function(req,res){
    res.render('main/view',data)

})
/*评论模块*/
router.get('/view/comments',function(req,res){
    res.render('main/comments',data)
})
module.exports = router;